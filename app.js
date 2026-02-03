const { useState, useEffect, useRef } = React;

const API = "https://magma-api.biz.id/dramabox";

function getCover(d) {
  return d.coverWap || d.cover || d.bookCover || d.coverUrl || "";
}

function App() {
  const [section, setSection] = useState("trending");
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEp, setCurrentEp] = useState(0);
  const [qualities, setQualities] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [preferredQuality, setPreferredQuality] = useState(
    Number(localStorage.getItem("dramakuy_quality")) || 720
  );
  const [currentQuality, setCurrentQuality] = useState(preferredQuality);

  const videoRef = useRef(null);

  const sectionNames = {
    trending: "Trending",
    foryou: "Untuk Kamu",
    vip: "VIP",
    latest: "Terbaru",
    dubindo: "Dub Indo"
  };

  useEffect(() => {
    fetchList();
  }, [section, page]);

  function fetchList() {
    setLoading(true);
    setSelected(null);

    fetch(`${API}/${section}?page=${page}`)
      .then(r => r.json())
      .then(j => {
        setList(j.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function search() {
    if (!query.trim()) return;
    setLoading(true);
    setPage(1);

    fetch(`${API}/search?query=${encodeURIComponent(query)}&page=1`)
      .then(r => r.json())
      .then(j => {
        setList(j.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function openDetail(d) {
    setSelected(d);
    setEpisodes([]);
    setVideoSrc("");

    fetch(`${API}/allepisode?bookId=${d.bookId}`)
      .then(r => r.json())
      .then(j => {
        const eps = j.data || [];
        setEpisodes(eps);
        if (eps.length) playEpisode(eps, 0);
      });
  }

  function playEpisode(epList, index) {
    const ep = epList[index];
    if (!ep) return;

    setCurrentEp(index);

    const cdn =
      ep.cdnList.find(c => c.isDefault === 1) || ep.cdnList[0];

    const videos = cdn.videoPathList || [];
    setQualities(videos);

    const chosen =
      videos.find(v => v.quality === preferredQuality) ||
      videos.find(v => v.quality === 720) ||
      videos[0];

    if (!chosen) return;

    setVideoSrc(chosen.videoPath);
    setCurrentQuality(chosen.quality);
  }

  function changeQuality(url) {
    const q = qualities.find(v => v.videoPath === url);
    if (!q) return;

    setPreferredQuality(q.quality);
    setCurrentQuality(q.quality);
    setVideoSrc(q.videoPath);
    localStorage.setItem("dramakuy_quality", q.quality);
  }

  function nextEpisode() {
    if (currentEp + 1 < episodes.length) {
      playEpisode(episodes, currentEp + 1);
    }
  }

  function prevEpisode() {
    if (currentEp > 0) {
      playEpisode(episodes, currentEp - 1);
    }
  }

  return (
    <>
      <header>
        <div className="logo">DramaKuy</div>

        <div className="nav-buttons">
          {Object.keys(sectionNames).map(s => (
            <button
              key={s}
              className={`nav-btn ${section === s ? "active" : ""}`}
              onClick={() => {
                setSection(s);
                setPage(1);
              }}
            >
              {sectionNames[s]}
            </button>
          ))}
        </div>

        <div className="search-container">
          <input
            placeholder="Cari drama..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
          />
          <button className="search-btn" onClick={search}>▶</button>
        </div>
      </header>

      <div className="main-content">
        {!selected ? (
          <>
            <h2 className="section-title">
              {sectionNames[section]}
            </h2>

            <div className="grid">
              {list.map(d => (
                <div
                  key={d.bookId}
                  className="card"
                  onClick={() => openDetail(d)}
                >
                  <div className="card-img-container">
                    <img className="card-img" src={getCover(d)} />
                  </div>
                  <div className="card-content">
                    <div className="card-title">{d.bookName}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                ◀ Prev
              </button>

              <div className="page-indicator">
                Page {page}
              </div>

              <button
                disabled={loading}
                onClick={() => setPage(p => p + 1)}
              >
                Next ▶
              </button>
            </div>

            {loading && <p style={{textAlign:"center"}}>Loading…</p>}
          </>
        ) : (
          <div className="detail-container">
            <button className="back-btn" onClick={() => setSelected(null)}>
              ← Kembali
            </button>

            <h1>{selected.bookName}</h1>
            <p>{selected.introduction}</p>

            <div className="video-container">
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                autoPlay
                onEnded={nextEpisode}
                style={{ width: "100%" }}
              />

              <div className="video-controls">
                <select
                  className="quality-selector"
                  value={videoSrc}
                  onChange={e => changeQuality(e.target.value)}
                >
                  {qualities.map(v => (
                    <option key={v.quality} value={v.videoPath}>
                      {v.quality}p
                    </option>
                  ))}
                </select>

                <div>
                  Episode {currentEp + 1} / {episodes.length} · {currentQuality}p
                </div>

                <div>
                  <button onClick={prevEpisode} disabled={currentEp === 0}>
                    ◀
                  </button>
                  <button
                    onClick={nextEpisode}
                    disabled={currentEp === episodes.length - 1}
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>

            <div className="episodes-container">
              {episodes.map((_, i) => (
                <button
                  key={i}
                  className={`episode-btn-list ${i === currentEp ? "active" : ""}`}
                  onClick={() => playEpisode(episodes, i)}
                >
                  Ep {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

ReactDOM
  .createRoot(document.getElementById("root"))
  .render(<App />);
