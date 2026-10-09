package main

import (
	"errors"
	"net/http"
	"sync"
	"time"
)

// hookLog keeps the last few webhook deliveries per endpoint in memory so a
// partner can see whether their integration is receiving events.
type hookLog struct {
	mu    sync.Mutex
	byURL map[string][]HookDelivery
}

type HookDelivery struct {
	Event  string    `json:"event"`
	At     time.Time `json:"at"`
	OK     bool      `json:"ok"`
	Error  string    `json:"error,omitempty"`
	Millis int64     `json:"ms"`
}

const hookLogSize = 20

func (l *hookLog) add(url string, d HookDelivery) {
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.byURL == nil {
		l.byURL = map[string][]HookDelivery{}
	}
	list := append([]HookDelivery{d}, l.byURL[url]...)
	if len(list) > hookLogSize {
		list = list[:hookLogSize]
	}
	l.byURL[url] = list
}

func (l *hookLog) recent(url string) []HookDelivery {
	l.mu.Lock()
	defer l.mu.Unlock()
	return append([]HookDelivery{}, l.byURL[url]...)
}

// testWebhook sends a signed "ping" event to the app's webhook URL and
// reports the result, so partners can check signature verification.
func (s *server) testWebhook(w http.ResponseWriter, r *http.Request) {
	var target, secret, id string
	err := s.ownedApp(r, func(a *App) error {
		if a.WebhookURL == "" {
			return errors.New("set a webhook URL first")
		}
		target, secret, id = a.WebhookURL, a.WebhookSecret, a.ID
		return nil
	})
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	err = s.postEvent(target, secret, "ping", map[string]any{"app_id": id, "message": "Test event from ORPay. Verify the ORPay-Signature header, then return 2xx."})
	d := s.hooks.recent(target)
	resp := map[string]any{"ok": err == nil}
	if err != nil {
		resp["error"] = err.Error()
	}
	if len(d) > 0 {
		resp["delivery"] = d[0]
	}
	writeJSON(w, http.StatusOK, resp)
}
