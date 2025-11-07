
export const DeviceTrust = {
  getOrCreateId(): string {
    let id = localStorage.getItem('device_trust_id');
    if (!id) {
      id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      localStorage.setItem('device_trust_id', id);
    }
    return id;
  },

  markTrusted(email?: string) {
    const id = this.getOrCreateId();
    const record = { id, email: email || null, ts: new Date().toISOString(), ua: navigator.userAgent };
    localStorage.setItem('trusted_device', JSON.stringify(record));
  },

  isTrusted(email?: string): boolean {
    try {
      const raw = localStorage.getItem('trusted_device');
      if (!raw) return false;
      const rec = JSON.parse(raw);
      if (email && rec.email && rec.email.toLowerCase() !== email.toLowerCase()) return false;
      return Boolean(rec.id);
    } catch {
      return false;
    }
  }
};
