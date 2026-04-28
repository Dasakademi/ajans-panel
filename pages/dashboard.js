import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { api } from '../lib/api';

const STATUS_RENK = { iyi: '#22c55e', dikkat: '#f59e0b', kritik: '#ef4444' };
const STATUS_BG = { iyi: '#22c55e18', dikkat: '#f59e0b18', kritik: '#ef444418' };

function MetrikKart({ baslik, deger, alt, renk, gecikme }) {
  return (
    <div className={`fade-up-${gecikme}`} style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 22px', flex: 1,
    }}>
      <p style={{ fontSize: 11, color: 'var(--text2)', margin: '0 0 10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {baslik}
      </p>
      <p style={{ fontSize: 28, fontWeight: 600, margin: '0 0 4px', color: renk || 'var(--text)', fontFamily: 'DM Mono, monospace' }}>
        {deger}
      </p>
      {alt && <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>{alt}</p>}
    </div>
  );
}

function MetaKart({ ozet, kampanyalar, yukleniyor }) {
  if (yukleniyor) return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px', textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
      Meta Ads yükleniyor...
    </div>
  );

  if (!ozet || ozet.error) return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
      <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>📊 Meta Ads</p>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--red)' }}>
        {ozet?.error || 'Bağlantı kurulamadı — META_ACCESS_TOKEN kontrol edin'}
      </p>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>📊 Meta Ads (7 gün)</p>
        <span style={{ fontSize: 11, color: 'var(--green)', background: '#22c55e12', border: '1px solid #22c55e30', padding: '2px 8px', borderRadius: 20 }}>Canlı</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Harcama', value: `₺${parseFloat(ozet.spend || 0).toFixed(2)}` },
          { label: 'Erişim', value: parseInt(ozet.reach || 0).toLocaleString('tr-TR') },
          { label: 'Tıklama', value: parseInt(ozet.clicks || 0).toLocaleString('tr-TR') },
          { label: 'CTR', value: `%${parseFloat(ozet.ctr || 0).toFixed(2)}` },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: 'DM Mono, monospace', color: 'var(--text)' }}>{m.value}</p>
          </div>
        ))}
      </div>

      {kampanyalar && kampanyalar.length > 0 && (
        <>
          <p style={{ margin: '0 0 10px', fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Kampanyalar</p>
          {kampanyalar.slice(0, 4).map((k, i) => {
            const ins = k.insights?.data?.[0] || {};
            return (
              <div key={k.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: k.status === 'ACTIVE' ? 'var(--green)' : 'var(--text3)' }} />
                <p style={{ margin: 0, fontSize: 12, flex: 1, color: 'var(--text)' }}>{k.name}</p>
                <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'DM Mono, monospace' }}>
                  ₺{parseFloat(ins.spend || 0).toFixed(0)}
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function MusteriSatir({ musteri, index }) {
  const durum = musteri.durum || 'iyi';
  return (
    <div className={`fade-up-${Math.min(index + 2, 5)}`} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '13px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${STATUS_BG[durum]}`,
        border: `1px solid ${STATUS_RENK[durum]}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, color: STATUS_RENK[durum], flexShrink: 0,
      }}>
        {musteri.name?.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{musteri.name}</p>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--text2)' }}>{musteri.email || 'email yok'}</p>
      </div>
      <div style={{
        padding: '3px 10px', borderRadius: 20,
        background: STATUS_BG[durum], border: `1px solid ${STATUS_RENK[durum]}40`,
        fontSize: 11, color: STATUS_RENK[durum], fontWeight: 500,
      }}>
        {durum}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [veri, setVeri] = useState(null);
  const [musteriler, setMusteriler] = useState([]);
  const [gorevler, setGorevler] = useState([]);
  const [sistem, setSistem] = useState(null);
  const [metaOzet, setMetaOzet] = useState(null);
  const [metaKampanyalar, setMetaKampanyalar] = useState([]);
  const [metaYukleniyor, setMetaYukleniyor] = useState(true);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aktifSayfa, setAktifSayfa] = useState('dashboard');

  useEffect(() => {
    if (!localStorage.getItem('ajans_giris')) { router.push('/'); return; }
    verileriYukle();
    const interval = setInterval(verileriYukle, 30000);
    return () => clearInterval(interval);
  }, []);

  async function verileriYukle() {
    const [d, m, t, s] = await Promise.all([
      api.dashboard(), api.clients(), api.tasks(), api.health()
    ]);
    if (d) setVeri(d);
    if (m) setMusteriler(m);
    if (t) setGorevler(t);
    if (s) setSistem(s);
    setYukleniyor(false);

    // Meta Ads verileri
    setMetaYukleniyor(true);
    const [mo, mk] = await Promise.all([api.meta.ozet(7), api.meta.kampanyalar(7)]);
    setMetaOzet(mo);
    setMetaKampanyalar(Array.isArray(mk) ? mk : []);
    setMetaYukleniyor(false);
  }

  async function raporGonder() {
    await api.triggerReport();
    alert('Rapor Telegram\'a gönderildi!');
  }

  function cikisYap() {
    localStorage.removeItem('ajans_giris');
    router.push('/');
  }

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'meta', label: 'Meta Ads', icon: '◈' },
    { id: 'musteriler', label: 'Müşteriler', icon: '◉' },
    { id: 'gorevler', label: 'Görevler', icon: '◎' },
    { id: 'raporlar', label: 'Raporlar', icon: '⊡' },
  ];

  return (
    <>
      <Head><title>Ajans Paneli</title></Head>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

        <aside style={{
          width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', padding: '24px 0',
          position: 'sticky', top: 0, height: '100vh',
        }}>
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Ajans Paneli</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div className="live-dot" />
                  <p style={{ margin: 0, fontSize: 10, color: 'var(--text2)' }}>Çevrimiçi</p>
                </div>
              </div>
            </div>
          </div>

          <nav style={{ padding: '16px 12px', flex: 1 }}>
            {nav.map(item => (
              <button key={item.id} onClick={() => setAktifSayfa(item.id)} style={{
                width: '100%', padding: '9px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: aktifSayfa === item.id ? 'var(--bg3)' : 'transparent',
                border: aktifSayfa === item.id ? '1px solid var(--border2)' : '1px solid transparent',
                borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
                color: aktifSayfa === item.id ? 'var(--text)' : 'var(--text2)',
                fontSize: 13, fontWeight: aktifSayfa === item.id ? 500 : 400,
                marginBottom: 3, textAlign: 'left', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
                {item.id === 'gorevler' && gorevler.length > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, background: '#ef444420', color: '#ef4444', padding: '2px 6px', borderRadius: 20, border: '1px solid #ef444430' }}>{gorevler.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={raporGonder} style={{ width: '100%', padding: '9px 12px', background: '#6c63ff18', border: '1px solid #6c63ff30', borderRadius: 9, color: 'var(--accent2)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 6 }}>
              📨 Rapor Gönder
            </button>
            <button onClick={cikisYap} style={{ width: '100%', padding: '9px 12px', background: 'transparent', border: '1px solid transparent', borderRadius: 9, color: 'var(--text3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Çıkış →
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
          <div className="fade-up" style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 600 }}>
                {aktifSayfa === 'dashboard' && 'Genel Bakış'}
                {aktifSayfa === 'meta' && 'Meta Ads'}
                {aktifSayfa === 'musteriler' && 'Müşteriler'}
                {aktifSayfa === 'gorevler' && 'Görevler'}
                {aktifSayfa === 'raporlar' && 'Raporlar'}
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text2)' }}>
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {sistem && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 20, background: sistem.anthropic_bagli ? '#22c55e12' : '#ef444412', border: `1px solid ${sistem.anthropic_bagli ? '#22c55e30' : '#ef444430'}`, fontSize: 11, color: sistem.anthropic_bagli ? '#22c55e' : '#ef4444' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                Claude {sistem.anthropic_bagli ? 'Bağlı' : 'Bağlı Değil'}
              </div>
            )}
          </div>

          {yukleniyor ? (
            <div style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', paddingTop: 60 }}>Yükleniyor...</div>
          ) : (
            <>
              {aktifSayfa === 'dashboard' && (
                <>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
                    <MetrikKart baslik="Aktif Müşteri" deger={veri?.toplam_musteri ?? musteriler.length} alt="toplam kayıtlı" renk="var(--accent2)" gecikme={1} />
                    <MetrikKart baslik="Bekleyen Görev" deger={veri?.bekleyen_gorev ?? gorevler.length} alt={`${veri?.acil_gorev ?? 0} acil`} renk={gorevler.length > 0 ? 'var(--amber)' : 'var(--green)'} gecikme={2} />
                    <MetrikKart baslik="Meta Harcama" deger={metaOzet?.spend ? `₺${parseFloat(metaOzet.spend).toFixed(0)}` : '—'} alt="son 7 gün" renk="var(--teal)" gecikme={3} />
                    <MetrikKart baslik="Son Güncelleme" deger={new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} alt="otomatik yenileme" gecikme={4} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="fade-up-3" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Müşteriler</p>
                        <span style={{ fontSize: 11, color: 'var(--text2)' }}>{musteriler.length} kayıt</span>
                      </div>
                      {musteriler.length === 0 ? (
                        <p style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Henüz müşteri yok</p>
                      ) : (
                        musteriler.slice(0, 6).map((m, i) => <MusteriSatir key={m.id} musteri={m} index={i} />)
                      )}
                    </div>

                    <MetaKart ozet={metaOzet} kampanyalar={metaKampanyalar} yukleniyor={metaYukleniyor} />
                  </div>
                </>
              )}

              {aktifSayfa === 'meta' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 14 }}>
                    {[
                      { label: 'Toplam Harcama', value: `₺${parseFloat(metaOzet?.spend || 0).toFixed(2)}`, renk: 'var(--teal)' },
                      { label: 'Erişim', value: parseInt(metaOzet?.reach || 0).toLocaleString('tr-TR'), renk: 'var(--accent2)' },
                      { label: 'Tıklama', value: parseInt(metaOzet?.clicks || 0).toLocaleString('tr-TR'), renk: 'var(--green)' },
                      { label: 'CTR', value: `%${parseFloat(metaOzet?.ctr || 0).toFixed(2)}`, renk: 'var(--amber)' },
                    ].map((m, i) => (
                      <MetrikKart key={m.label} baslik={m.label} deger={metaYukleniyor ? '...' : m.value} alt="son 7 gün" renk={m.renk} gecikme={i + 1} />
                    ))}
                  </div>

                  <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
                    <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 500 }}>Tüm Kampanyalar</p>
                    {metaYukleniyor ? (
                      <p style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Yükleniyor...</p>
                    ) : metaKampanyalar.length === 0 ? (
                      <p style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                        {metaOzet?.error || 'Kampanya bulunamadı'}
                      </p>
                    ) : (
                      metaKampanyalar.map((k, i) => {
                        const ins = k.insights?.data?.[0] || {};
                        return (
                          <div key={k.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: k.status === 'ACTIVE' ? 'var(--green)' : 'var(--text3)' }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 500 }}>{k.name}</p>
                              <p style={{ margin: 0, fontSize: 11, color: 'var(--text2)' }}>{k.objective}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ margin: '0 0 2px', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>₺{parseFloat(ins.spend || 0).toFixed(2)}</p>
                              <p style={{ margin: 0, fontSize: 11, color: 'var(--text2)' }}>{ins.clicks || 0} tık · %{parseFloat(ins.ctr || 0).toFixed(2)} CTR</p>
                            </div>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: k.status === 'ACTIVE' ? '#22c55e18' : '#ffffff0a', color: k.status === 'ACTIVE' ? '#22c55e' : 'var(--text3)', border: `1px solid ${k.status === 'ACTIVE' ? '#22c55e30' : 'var(--border)'}` }}>
                              {k.status === 'ACTIVE' ? 'Aktif' : 'Durduruldu'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {aktifSayfa === 'musteriler' && (
                <div className="fade-up" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Tüm Müşteriler</p>
                  </div>
                  {musteriler.length === 0 ? (
                    <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Henüz müşteri eklenmemiş.</p>
                  ) : (
                    musteriler.map((m, i) => <MusteriSatir key={m.id} musteri={m} index={i} />)
                  )}
                </div>
              )}

              {aktifSayfa === 'gorevler' && (
                <div className="fade-up" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 500 }}>Tüm Görevler</p>
                  {gorevler.length === 0 ? (
                    <p style={{ color: 'var(--green)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Tüm görevler tamamlandı ✓</p>
                  ) : (
                    gorevler.map((g) => (
                      <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: g.priority === 'urgent' ? 'var(--red)' : g.priority === 'high' ? 'var(--amber)' : 'var(--text3)' }} />
                        <p style={{ margin: 0, fontSize: 13, flex: 1 }}>{g.title}</p>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: g.priority === 'urgent' ? '#ef444420' : '#f59e0b20', color: g.priority === 'urgent' ? '#ef4444' : '#f59e0b', border: `1px solid ${g.priority === 'urgent' ? '#ef444430' : '#f59e0b30'}` }}>{g.priority}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {aktifSayfa === 'raporlar' && (
                <div className="fade-up" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
                  <p style={{ fontSize: 32, margin: '0 0 12px' }}>📨</p>
                  <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>Rapor Merkezi</p>
                  <p style={{ fontSize: 13, color: 'var(--text2)', margin: '0 0 24px' }}>Raporlar her gün sabah 08:00 ve akşam 18:00'de Telegram'a otomatik gönderilir.</p>
                  <button onClick={raporGonder} style={{ padding: '11px 24px', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Şimdi Rapor Gönder
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
