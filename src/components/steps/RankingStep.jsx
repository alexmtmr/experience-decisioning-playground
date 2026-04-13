import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FONT_SERIF, FONT_SANS, FONT_MONO, T } from '../../theme';
import { OFFERS } from '../../data/offers';
import { RANKING_METHODS } from '../../data/rankings';
import { Label, Card, Badge, Tip } from '../ui';
import styles from './RankingStep.module.css';

/* Step 5 — Pick a ranking method, watch all 10 offers re-rank live */
export const RankingStep = () => {
  const [method, setMethod] = useState('priority');
  const [sliders, setSliders] = useState(Object.fromEntries(OFFERS.map(o => [o.id, o.priority])));
  const [boost, setBoost] = useState(30);
  const [aiSeed, setAiSeed] = useState(0);

  const ranked = [...OFFERS].map(item => {
    let score;
    if (method === 'priority') score = sliders[item.id] || item.priority;
    else if (method === 'formula') score = item.priority + (item.margin === 'High' ? boost : item.margin === 'Medium' ? Math.round(boost * 0.5) : 0);
    else { const seeds = [[96,78,51,91,42,84,60,65,38,73],[88,55,92,71,79,60,45,82,63,86],[72,81,45,58,93,68,50,44,82,77]]; score = seeds[aiSeed % 3][(item.id - 1) % 10]; }
    return { ...item, score };
  }).sort((a, b) => b.score - a.score);

  return (
    <div>
      <Label>Step 05 — The Engine</Label>
      <h1 className={styles.title}>Ranking Methods</h1>
      <p className={styles.desc}>Pick a method and see all 10 offers re-rank live.</p>

      {/* Method cards */}
      <div className={styles.methodGrid}>
        {RANKING_METHODS.map(m => {
          const Icon = m.icon;
          return (
            <Card key={m.id} hoverable onClick={() => setMethod(m.id)}
              style={{ padding: 14, borderTop: `3px solid ${method === m.id ? T.ac : 'transparent'}`, background: method === m.id ? T.as : T.sf }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Icon size={15} color={method === m.id ? T.ac : T.tm} />
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3].map(n => <div key={n} style={{ width: 5, height: 5, borderRadius: '50%', background: n <= m.effort ? (method === m.id ? T.ac : T.tm) : T.bd }} />)}
                </div>
              </div>
              <h3 className={styles.methodName}>{m.name}</h3>
              <p className={styles.methodDesc}>{m.desc}</p>
            </Card>
          );
        })}
      </div>

      <div className={styles.mainGrid}>
        {/* Left: controls */}
        <Card style={{ overflow: 'auto' }}>
          {method === 'priority' && (
            <>
              {OFFERS.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <Icon size={11} color={item.color} />
                      <span style={{ fontFamily: FONT_SANS, fontSize: 10.5, color: T.tx, flex: 1 }}>
                        {item.name.length > 24 ? item.name.slice(0, 24) + '…' : item.name}
                      </span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, color: item.color }}>{sliders[item.id]}</span>
                    </div>
                    <input type="range" min={0} max={100} value={sliders[item.id]}
                      onChange={e => setSliders(p => ({ ...p, [item.id]: +e.target.value }))}
                      style={{ width: '100%', accentColor: item.color }} />
                  </div>
                );
              })}
            </>
          )}

          {method === 'formula' && (
            <>
              <Label>Formula</Label>
              <div className={styles.formulaBox}>
                <span style={{ color: T.ac, fontWeight: 600 }}>SCORE</span> = priority<br />
                &nbsp;&nbsp;+ <span style={{ color: T.gn }}>IF</span> margin="High" → <span style={{ color: T.gl }}>+{boost}</span><br />
                &nbsp;&nbsp;+ <span style={{ color: T.gn }}>IF</span> margin="Med" → <span style={{ color: T.gl }}>+{Math.round(boost * 0.5)}</span>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, marginBottom: 3 }}>Boost: <strong>{boost}</strong></div>
              <input type="range" min={0} max={60} value={boost} onChange={e => setBoost(+e.target.value)} style={{ width: '100%', accentColor: T.gl }} />
            </>
          )}

          {method === 'ai' && (
            <>
              <Label>AI — Personalized Optimization</Label>
              <div className={styles.aiStats}>
                {[{ v: '9', l: 'variants' }, { v: '6mo', l: 'training' }, { v: 'conv.', l: 'goal' }].map(s => (
                  <div key={s.l} className={styles.aiStat}>
                    <div className={styles.aiStatVal}>{s.v}</div>
                    <div className={styles.aiStatLabel}>{s.l}</div>
                  </div>
                ))}
              </div>
              <button className={styles.simBtn} onClick={() => setAiSeed(s => s + 1)}>
                <Sparkles size={13} />Simulate Visitor
              </button>
            </>
          )}
        </Card>

        {/* Right: animated ranking list */}
        <Card style={{ overflow: 'hidden' }}>
          <Label>Ranking</Label>
          <div style={{ position: 'relative', height: ranked.length * 40 }}>
            {ranked.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.id} style={{
                  position: 'absolute', left: 0, right: 0, height: 36,
                  transform: `translateY(${i * 40}px)`,
                  transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                  zIndex: i === 0 ? 2 : 1,
                  display: 'flex', alignItems: 'center', gap: 7, padding: '6px 9px', borderRadius: 7,
                  background: i === 0 ? item.color + '08' : T.sf,
                  borderLeft: `3px solid ${i < 3 ? item.color : T.bd}`,
                  border: `1px solid ${i === 0 ? item.color + '25' : T.bd}`,
                  boxShadow: i === 0 ? `0 2px 8px ${item.color}15` : 'none',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i === 0 ? item.color : T.sa, color: i === 0 ? '#fff' : T.tm,
                    fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, flexShrink: 0,
                    transition: 'background 0.4s ease, color 0.4s ease',
                  }}>{item.score}</div>
                  <Icon size={11} color={i < 3 ? item.color : T.tm} style={{ transition: 'color 0.3s' }} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: i < 3 ? 600 : 400, color: i < 3 ? T.tx : T.tm, flex: 1, transition: 'color 0.3s, font-weight 0.3s' }}>
                    {item.name.length > 20 ? item.name.slice(0, 20) + '…' : item.name}
                  </span>
                  {i === 0 && <Badge color={T.gn}>Win</Badge>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {method === 'priority' && (
        <Tip title="Schema priority vs. Priority ranking — what's the difference?">
          The <strong>schema priority</strong> is a default score you set once per offer — it's the item's baseline importance. The <strong>priority ranking method</strong> uses that score at decision time to pick the highest-priority offer. When you choose a Formula or AI model instead, the schema priority can still be an input — but it's combined with other signals rather than being the sole decider. <strong>What if both exist?</strong> The ranking method always wins. If you set schema priority to 100 on an offer but the Formula computes a score of 40 (because of low margin or poor context fit), the offer ranks at 40 — not 100. The schema priority only acts as the sole decider when "Item Priority" is explicitly selected as the ranking method.
        </Tip>
      )}
    </div>
  );
};
