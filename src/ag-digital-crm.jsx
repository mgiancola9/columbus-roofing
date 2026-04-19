import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const STATUS_CONFIG = {
  new: { label: "New", bg: "#E6F1FB", color: "#0C447C", border: "#85B7EB" },
  qualifying: { label: "Qualifying", bg: "#FAEEDA", color: "#633806", border: "#FAC775" },
  qualified: { label: "Qualified", bg: "#EAF3DE", color: "#27500A", border: "#97C459" },
  sent: { label: "Sent to Contractor", bg: "#EEEDFE", color: "#3C3489", border: "#AFA9EC" },
  quoted: { label: "Quoted", bg: "#E1F5EE", color: "#085041", border: "#5DCAA5" },
  won: { label: "Won", bg: "#085041", color: "#E1F5EE", border: "#0F6E56" },
  lost: { label: "Lost", bg: "#F1EFE8", color: "#444441", border: "#B4B2A9" },
  bad: { label: "Bad Lead", bg: "#FCEBEB", color: "#791F1F", border: "#F09595" },
};

const SERVICE_TYPES = [
  "Storm Damage", "Full Replacement", "Roof Repair",
  "Free Inspection", "Insurance Claim", "Gutter Repair",
];

const SOURCES = ["Roof Cost Calculator", "Insurance Check", "Main Website", "Referral", "Phone Call"];

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "6px",
      fontSize: "11px", fontWeight: 500, letterSpacing: "0.02em",
      background: c.bg, color: c.color, border: `1px solid ${c.border}`, whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: "10px",
      background: accent ? "#1a2332" : "rgba(0,0,0,0.03)", minWidth: 0,
    }}>
      <div style={{ fontSize: "11px", color: accent ? "rgba(255,255,255,0.5)" : "#888780", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "22px", fontWeight: 600, color: accent ? "#c8962e" : "#1a2332", fontFamily: "'DM Mono', monospace" }}>
        {value}
      </div>
    </div>
  );
}

export default function AGDigitalCRM() {
  const [leads, setLeads] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [view, setView] = useState("pipeline");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterContractor, setFilterContractor] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch leads and contractors from Supabase
  const fetchData = useCallback(async () => {
    const [leadsRes, contractorsRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("contractors").select("*").order("created_at", { ascending: false }),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data);
    if (contractorsRes.data) setContractors(contractorsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    // Real-time subscription for leads
    const leadsChannel = supabase
      .channel("leads-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(leadsChannel); };
  }, [fetchData]);

  const updateLead = useCallback(async (id, updates) => {
    // Add timestamps based on status change
    if (updates.status === "qualified") updates.qualified_at = new Date().toISOString();
    if (updates.status === "sent") updates.sent_at = new Date().toISOString();
    if (updates.status === "quoted") updates.quoted_at = new Date().toISOString();
    if (updates.status === "won" || updates.status === "lost") updates.closed_at = new Date().toISOString();

    const { error } = await supabase.from("leads").update(updates).eq("id", id);
    if (error) { console.error("Update failed:", error); return; }

    // Log the activity
    if (updates.status) {
      await supabase.from("lead_activity").insert({
        lead_id: id,
        action: "status_change",
        new_value: updates.status,
        performed_by: "manual",
      });
    }
    if (updates.contractor_id !== undefined) {
      await supabase.from("lead_activity").insert({
        lead_id: id,
        action: "assigned_contractor",
        new_value: updates.contractor_id,
        performed_by: "manual",
      });
    }

    // Update local state
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => ({ ...prev, ...updates }));
    }
  }, [selectedLead]);

  const addLead = useCallback(async (lead) => {
    const { data, error } = await supabase.from("leads").insert({
      first_name: lead.firstName,
      last_name: lead.lastName,
      phone: lead.phone,
      address: lead.address,
      service_type: lead.serviceType,
      source: lead.source,
      status: "new",
    }).select().single();

    if (error) { console.error("Insert failed:", error); return; }
    setLeads((prev) => [data, ...prev]);
    setShowAddLead(false);
  }, []);

  const addContractor = useCallback(async (contractor) => {
    const { data, error } = await supabase.from("contractors").insert({
      name: contractor.name,
      contact_name: contractor.contact,
      phone: contractor.phone,
      email: contractor.email,
      zip_codes: contractor.zipCodes,
      specialties: contractor.specialties,
    }).select().single();

    if (error) { console.error("Insert failed:", error); return; }
    setContractors((prev) => [...prev, data]);
    setShowAddContractor(false);
  }, []);

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>Loading CRM data...</div>;
  }

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    qualified: leads.filter((l) => ["qualified", "sent", "quoted"].includes(l.status)).length,
    won: leads.filter((l) => l.status === "won").length,
    lost: leads.filter((l) => l.status === "lost" || l.status === "bad").length,
  };

  const filteredLeads = leads.filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterContractor !== "all" && l.contractor_id !== filterContractor) return false;
    return true;
  });

  const getContractorName = (id) => {
    const c = contractors.find((c) => c.id === id);
    return c ? c.name : "—";
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: "100%", padding: "0" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#1a2332", padding: "16px 20px", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#c8962e", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>A&G Digital</div>
          <div style={{ color: "#fff", fontSize: "17px", fontWeight: 600, marginTop: "2px" }}>Lead Management CRM</div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["pipeline", "contractors"].map((v) => (
            <button key={v} onClick={() => { setView(v); setSelectedLead(null); }}
              style={{
                padding: "6px 14px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 500, cursor: "pointer",
                background: view === v ? "#c8962e" : "rgba(255,255,255,0.08)",
                color: view === v ? "#1a2332" : "rgba(255,255,255,0.6)", transition: "all 0.15s",
              }}>
              {v === "pipeline" ? "Lead Pipeline" : "Contractors"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#faf8f4", borderRadius: "0 0 10px 10px", border: "1px solid #e8e5dd", borderTop: "none" }}>
        {/* Stats */}
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "10px" }}>
          <StatCard label="Total leads" value={stats.total} />
          <StatCard label="New" value={stats.new} />
          <StatCard label="In pipeline" value={stats.qualified} />
          <StatCard label="Won" value={stats.won} accent />
          <StatCard label="Lost / Bad" value={stats.lost} />
        </div>

        {view === "pipeline" && (
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "12px", background: "#fff", color: "#1a2332" }}>
                  <option value="all">All statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
                </select>
                <select value={filterContractor} onChange={(e) => setFilterContractor(e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "12px", background: "#fff", color: "#1a2332" }}>
                  <option value="all">All contractors</option>
                  {contractors.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <button onClick={() => setShowAddLead(true)}
                style={{ padding: "6px 14px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "#c8962e", color: "#fff" }}>
                + Add lead
              </button>
            </div>

            <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e8e5dd", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f5f3ee" }}>
                    {["Name", "Phone", "Service", "Source", "Status", "Contractor", "Date"].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#5f5e5a", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "1px solid #e8e5dd" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>No leads yet — they'll appear here when forms are submitted</td></tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} onClick={() => setSelectedLead(lead)}
                        style={{ cursor: "pointer", borderBottom: "1px solid #f0ede6", transition: "background 0.1s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8f4")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <td style={{ padding: "10px 12px", fontWeight: 500, color: "#1a2332" }}>{lead.first_name} {lead.last_name || ""}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#5f5e5a" }}>{lead.phone}</td>
                        <td style={{ padding: "10px 12px", color: "#5f5e5a" }}>{lead.service_type}</td>
                        <td style={{ padding: "10px 12px", color: "#888" }}>{lead.source}</td>
                        <td style={{ padding: "10px 12px" }}><StatusBadge status={lead.status} /></td>
                        <td style={{ padding: "10px 12px", color: "#5f5e5a" }}>{getContractorName(lead.contractor_id)}</td>
                        <td style={{ padding: "10px 12px", color: "#888", fontSize: "12px" }}>
                          {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === "contractors" && (
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a2332" }}>Contractor partners</div>
              <button onClick={() => setShowAddContractor(true)}
                style={{ padding: "6px 14px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "#c8962e", color: "#fff" }}>
                + Add contractor
              </button>
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              {contractors.map((c) => {
                const cLeads = leads.filter((l) => l.contractor_id === c.id);
                const won = cLeads.filter((l) => l.status === "won").length;
                return (
                  <div key={c.id} style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e8e5dd", padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 600, color: "#1a2332" }}>{c.name}</div>
                        <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>Contact: {c.contact_name} {c.phone && `| ${c.phone}`}</div>
                      </div>
                      <div style={{ display: "flex", gap: "16px", textAlign: "center" }}>
                        <div>
                          <div style={{ fontSize: "18px", fontWeight: 600, color: "#1a2332", fontFamily: "'DM Mono', monospace" }}>{cLeads.length}</div>
                          <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" }}>Leads sent</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "18px", fontWeight: 600, color: "#0F6E56", fontFamily: "'DM Mono', monospace" }}>{won}</div>
                          <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" }}>Won</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {(c.specialties || []).map((s) => (
                        <span key={s} style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: "#f5f3ee", color: "#5f5e5a" }}>{s}</span>
                      ))}
                    </div>
                    {c.zip_codes && c.zip_codes.length > 0 && (
                      <div style={{ marginTop: "6px", fontSize: "11px", color: "#888" }}>Zip codes: {c.zip_codes.join(", ")}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedLead(null); }}>
          <div style={{ background: "#fff", borderRadius: "12px", width: "90%", maxWidth: "520px", maxHeight: "85vh", overflow: "auto", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 600, color: "#1a2332" }}>{selectedLead.first_name} {selectedLead.last_name || ""}</div>
                <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{new Date(selectedLead.created_at).toLocaleString()}</div>
              </div>
              <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888", padding: "0 4px" }}>x</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {[
                ["Phone", selectedLead.phone, true],
                ["Service", selectedLead.service_type],
                ["Address", selectedLead.address || "—"],
                ["Source", selectedLead.source],
              ].map(([label, val, mono]) => (
                <div key={label}>
                  <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontSize: "14px", color: "#1a2332", fontFamily: mono ? "'DM Mono', monospace" : "inherit" }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #e8e5dd", paddingTop: "16px", marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>Status</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <button key={k} onClick={() => updateLead(selectedLead.id, { status: k })}
                    style={{
                      padding: "4px 10px", borderRadius: "5px", fontSize: "11px", cursor: "pointer",
                      border: selectedLead.status === k ? `2px solid ${v.border}` : "1px solid #d3d1c7",
                      fontWeight: selectedLead.status === k ? 600 : 400,
                      background: selectedLead.status === k ? v.bg : "#fff",
                      color: selectedLead.status === k ? v.color : "#5f5e5a",
                    }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>Assign to contractor</div>
              <select value={selectedLead.contractor_id || ""}
                onChange={(e) => updateLead(selectedLead.id, { contractor_id: e.target.value || null })}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "13px", background: "#fff", color: "#1a2332" }}>
                <option value="">Unassigned</option>
                {contractors.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>

            <div>
              <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>Notes</div>
              <textarea value={selectedLead.notes || ""}
                onChange={(e) => updateLead(selectedLead.id, { notes: e.target.value })}
                placeholder="Add qualifying notes, call outcome, etc."
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "13px", minHeight: "70px", resize: "vertical", fontFamily: "inherit", color: "#1a2332", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddLead(false); }}>
          <div style={{ background: "#fff", borderRadius: "12px", width: "90%", maxWidth: "440px", padding: "24px" }}>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#1a2332", marginBottom: "16px" }}>Add new lead</div>
            <LeadForm onSubmit={addLead} onCancel={() => setShowAddLead(false)} />
          </div>
        </div>
      )}

      {/* Add Contractor Modal */}
      {showAddContractor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddContractor(false); }}>
          <div style={{ background: "#fff", borderRadius: "12px", width: "90%", maxWidth: "440px", padding: "24px" }}>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#1a2332", marginBottom: "16px" }}>Add contractor</div>
            <ContractorForm onSubmit={addContractor} onCancel={() => setShowAddContractor(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function LeadForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", address: "", serviceType: SERVICE_TYPES[0], source: SOURCES[0] });
  const s = { width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "13px", marginBottom: "10px", color: "#1a2332", boxSizing: "border-box" };
  const l = { fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "3px", display: "block" };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div><label style={l}>First name</label><input style={s} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
        <div><label style={l}>Last name</label><input style={s} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
      </div>
      <label style={l}>Phone</label><input style={s} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <label style={l}>Address</label><input style={s} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div><label style={l}>Service type</label><select style={s} value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>{SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
        <div><label style={l}>Source</label><select style={s} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>{SOURCES.map((t) => <option key={t}>{t}</option>)}</select></div>
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
        <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "13px", cursor: "pointer", background: "#fff", color: "#5f5e5a" }}>Cancel</button>
        <button onClick={() => { if (form.firstName && form.phone) onSubmit(form); }}
          style={{ padding: "8px 16px", borderRadius: "6px", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: "#c8962e", color: "#fff" }}>Add lead</button>
      </div>
    </div>
  );
}

function ContractorForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: "", contact: "", phone: "", email: "", zipCodes: "", specialties: [] });
  const s = { width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "13px", marginBottom: "10px", color: "#1a2332", boxSizing: "border-box" };
  const l = { fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "3px", display: "block" };
  return (
    <div>
      <label style={l}>Company name</label><input style={s} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <label style={l}>Contact person</label><input style={s} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div><label style={l}>Phone</label><input style={s} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label style={l}>Email</label><input style={s} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      </div>
      <label style={l}>Zip codes (comma separated)</label><input style={s} value={form.zipCodes} onChange={(e) => setForm({ ...form, zipCodes: e.target.value })} placeholder="43201, 43202, 43203" />
      <label style={l}>Specialties</label>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px" }}>
        {SERVICE_TYPES.map((t) => (
          <button key={t} onClick={() => setForm({ ...form, specialties: form.specialties.includes(t) ? form.specialties.filter((x) => x !== t) : [...form.specialties, t] })}
            style={{
              padding: "4px 10px", borderRadius: "5px", fontSize: "11px", cursor: "pointer",
              border: form.specialties.includes(t) ? "1px solid #c8962e" : "1px solid #d3d1c7",
              background: form.specialties.includes(t) ? "#faeeda" : "#fff",
              color: form.specialties.includes(t) ? "#633806" : "#5f5e5a",
            }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #d3d1c7", fontSize: "13px", cursor: "pointer", background: "#fff", color: "#5f5e5a" }}>Cancel</button>
        <button onClick={() => { if (form.name) onSubmit({ ...form, zipCodes: form.zipCodes.split(",").map((z) => z.trim()).filter(Boolean) }); }}
          style={{ padding: "8px 16px", borderRadius: "6px", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: "#c8962e", color: "#fff" }}>Add contractor</button>
      </div>
    </div>
  );
}