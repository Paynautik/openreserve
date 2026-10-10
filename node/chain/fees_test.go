package chain

import (
	"errors"
	"testing"

	"github.com/openreserve/node/ledger"
	"github.com/openreserve/node/types"
)

// Platform fees: tiered transfer fees and the escrow fee, both paid to the
// issuer, with refunds fee-free.
func TestPlatformFees(t *testing.T) {
	f := newFixture(t)
	issuer, arb := newActor(t), newActor(t)
	N := func(naira uint64) types.Amount { return types.Amount(naira) * types.Unit }
	f.g.Assets = []ledger.AssetDef{{
		Symbol: "NGN", Name: "Naira", Issuer: issuer.addr, MinFee: N(10), Decimals: 2,
		TransferTiers: []ledger.FeeTier{{UpTo: N(5000), Fee: N(10)}, {UpTo: N(50000), Fee: N(25)}, {Fee: N(50)}},
		EscrowFeeBps:  150, EscrowFeeMin: N(200), EscrowFeeMax: N(10000),
	}}
	c := f.open(t.TempDir())
	nonce := map[types.Address]uint64{}
	submit := func(a actor, tx *types.Tx) error {
		tx.ChainID, tx.From, tx.Nonce = f.g.ChainID, a.addr, nonce[a.addr]
		tx.Sign(a.priv)
		if _, err := c.Submit(tx); err != nil {
			return err
		}
		nonce[a.addr]++
		f.produce(c)
		return nil
	}
	must := func(a actor, tx *types.Tx) {
		t.Helper()
		if err := submit(a, tx); err != nil {
			t.Fatal(err)
		}
	}
	bal := func(a actor) types.Amount { c.mu.RLock(); defer c.mu.RUnlock(); return c.state.Balance(a.addr, "NGN") }
	must(issuer, &types.Tx{Kind: types.KindMint, Asset: "NGN", To: f.alice.addr, Amount: N(2_000_000)})

	// Tiered transfer fees.
	for _, tc := range []struct{ amount, need types.Amount }{{N(5000), N(10)}, {N(5001), N(25)}, {N(50000), N(25)}, {N(50001), N(50)}} {
		if err := submit(f.alice, &types.Tx{Asset: "NGN", To: f.bob.addr, Amount: tc.amount, Fee: tc.need - 1}); !errors.Is(err, ledger.ErrFeeTooLow) {
			t.Fatalf("amount %d with fee %d: %v", tc.amount, tc.need-1, err)
		}
		must(f.alice, &types.Tx{Asset: "NGN", To: f.bob.addr, Amount: tc.amount, Fee: tc.need})
	}
	feesSoFar := N(10 + 25 + 25 + 50)
	if got := bal(issuer); got != feesSoFar {
		t.Fatalf("issuer after transfers %d want %d", got, feesSoFar)
	}

	// Escrow: 1.5% of ₦420,000 = ₦6,300, taken from the seller across milestones.
	sellerBefore := bal(f.bob)
	esc := &types.EscrowOp{Op: types.EscrowCreate, Seller: f.bob.addr, Arbiter: arb.addr, Milestones: []types.Amount{N(120000), N(300000)}, ShipBy: f.now + 10_000, ReviewSecs: 3600}
	tx := &types.Tx{Asset: "NGN", Fee: N(10), Escrow: esc}
	must(f.alice, tx)
	id := tx.ID()
	if e := c.Escrow(id); e.PlatformFee != N(6300) {
		t.Fatalf("platform fee %d", e.PlatformFee)
	}
	must(f.alice, &types.Tx{Asset: "NGN", Escrow: &types.EscrowOp{Op: types.EscrowRelease, ID: id}})
	must(f.alice, &types.Tx{Asset: "NGN", Escrow: &types.EscrowOp{Op: types.EscrowRelease, ID: id}})
	if got := bal(f.bob) - sellerBefore; got != N(420000)-N(6300) {
		t.Fatalf("seller received %d", got)
	}
	if got := bal(issuer) - feesSoFar - N(10); got != N(6300) {
		t.Fatalf("issuer escrow fee %d", got)
	}
	if e := c.Escrow(id); e.FeePaid != N(6300) || e.Status != ledger.EscrowCompleted {
		t.Fatalf("after release: %+v", e)
	}

	// A refunded escrow costs the buyer nothing beyond the create fee; small
	// deals pay the ₦200 minimum, capped at the deal size.
	aliceBefore := bal(f.alice)
	tx = &types.Tx{Asset: "NGN", Fee: N(10), Escrow: &types.EscrowOp{Op: types.EscrowCreate, Seller: f.bob.addr, Arbiter: arb.addr, Milestones: []types.Amount{N(1000)}, ShipBy: f.now + 10_000, ReviewSecs: 3600}}
	must(f.alice, tx)
	if e := c.Escrow(tx.ID()); e.PlatformFee != N(200) {
		t.Fatalf("minimum fee %d", e.PlatformFee)
	}
	must(f.bob, &types.Tx{Asset: "NGN", Escrow: &types.EscrowOp{Op: types.EscrowRefund, ID: tx.ID()}})
	if got := aliceBefore - bal(f.alice); got != N(10) {
		t.Fatalf("refund cost the buyer %d", got)
	}
}

func TestFeeHelpers(t *testing.T) {
	d := ledger.AssetDef{EscrowFeeBps: 150, EscrowFeeMin: 200, EscrowFeeMax: 10_000, PotFeeBps: 100, PotFeeMax: 2_000}
	for total, want := range map[types.Amount]types.Amount{100: 100, 1_000: 200, 420_000: 6_300, 10_000_000: 10_000} {
		if got := d.EscrowFee(total); got != want {
			t.Errorf("EscrowFee(%d) = %d want %d", total, got, want)
		}
	}
	if d.PotFee(100_000) != 1_000 || d.PotFee(1_000_000) != 2_000 || (ledger.AssetDef{}).PotFee(5) != 0 {
		t.Error("PotFee")
	}
}
