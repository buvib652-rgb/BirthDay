import React, { useEffect, useState } from 'react';
import {
  loginAdmin,
  fetchSettings,
  saveSettings,
  fetchLoveLetter,
  saveLoveLetter,
  fetchGalleryPhotos,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
  fetchMusicTrack,
  uploadMusicTrack,
  deleteMusicTrack,
  fetchTimelineEvents,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineImage,
  getFullImageUrl,
} from '../services/api';

const TARGET_MEMORIES = [
  { key: 'firstTalk', title: 'First Talk', date: 'The very beginning', emoji: 'chat', defaultDesc: 'The message that started it all — I had no idea my life was about to change forever.' },
  { key: 'firstSmile', title: 'First Smile', date: 'Shortly after', emoji: 'smile', defaultDesc: 'You smiled and I forgot every word I had ever known.' },
  { key: 'firstCall', title: 'First Call', date: 'Growing closer', emoji: 'call', defaultDesc: 'We talked for hours and I never wanted to hang up.' },
  { key: 'firstMeet', title: 'First Meet', date: 'A beautiful day', emoji: 'flower', defaultDesc: 'Seeing you in person for the first time — you were even more beautiful.' },
  { key: 'firstSelfie', title: 'First Selfie', date: 'A precious moment', emoji: 'selfie', defaultDesc: 'That photo still makes me smile every time I look at it.' },
  { key: 'firstFight', title: 'First Fight', date: 'A tough moment', emoji: 'rain', defaultDesc: 'Even through the storm, we came back stronger. That is when I knew.' },
  { key: 'firstGift', title: 'First Gift', date: 'A celebration', emoji: 'gift', defaultDesc: 'Watching your eyes light up was the best gift I could have received.' },
  { key: 'favouriteMemory', title: 'Favourite Memory', date: 'Unforgettable', emoji: 'star', defaultDesc: 'The moment I knew I never wanted to be anywhere else but with you.' },
];


const getStoredToken = () => {
  try {
    return localStorage.getItem('admin_token') || '';
  } catch {
    return window.__admin_token || '';
  }
};

const setStoredToken = (val) => {
  window.__admin_token = val;
  try {
    if (val) {
      localStorage.setItem('admin_token', val);
    } else {
      localStorage.removeItem('admin_token');
    }
  } catch (err) {
    console.warn('Storage blocked by browser tracking prevention:', err);
  }
};

export default function AdminDashboard() {
  const [token, setToken] = useState(getStoredToken);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredToken());

  // Login form state
  const [email, setEmail] = useState('admin@birthday.com');
  const [password, setPassword] = useState('Change_This_Password_123');
  const [loginError, setLoginError] = useState('');

  // Dashboard settings form state
  const [hername, setHername] = useState('');
  const [birthdayDate, setBirthdayDate] = useState('');
  const [loveStartDate, setLoveStartDate] = useState('');
  const [settingsStatus, setSettingsStatus] = useState('');

  // Love letter form state
  const [letterTitle, setLetterTitle] = useState('');
  const [letterMessage, setLetterMessage] = useState('');
  const [letterStatus, setLetterStatus] = useState('');

  // Photos state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [photos, setPhotos] = useState([]);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);

  // Background Music form state
  const [musicFile, setMusicFile] = useState(null);
  const [songTitle, setSongTitle] = useState('Our Song');
  const [musicStatus, setMusicStatus] = useState('');
  const [currentMusic, setCurrentMusic] = useState(null);

  // Timeline memories form state
  const [timelineData, setTimelineData] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      loadSettings();
      loadLetter();
      loadPhotos();
      loadMusic();
      loadTimeline();
    }
  }, [isLoggedIn]);

  const loadTimeline = async () => {
    try {
      const events = await fetchTimelineEvents();
      const initialMap = {};
      TARGET_MEMORIES.forEach((m, idx) => {
        const found = Array.isArray(events)
          ? events.find((e) => e.title?.toLowerCase().trim() === m.title.toLowerCase().trim())
          : null;

        initialMap[m.title] = {
          _id: found?._id || null,
          text: (found?.description || found?.desc) ? (found.description || found.desc) : m.defaultDesc,
          savedImage: (found?.imageUrl && found.imageUrl !== 'null' && found.imageUrl !== 'undefined') ? found.imageUrl : '',
          imageDeleted: found?.imageDeleted === true,
          newFile: null,
          localPreview: null,
          status: '',
          order: found?.order !== undefined ? found.order : idx,
          emoji: m.emoji,
          date: m.date,
        };
      });
      setTimelineData(initialMap);
    } catch {
      const initialMap = {};
      TARGET_MEMORIES.forEach((m, idx) => {
        initialMap[m.title] = {
          _id: null,
          text: m.defaultDesc,
          savedImage: '',
          imageDeleted: false,
          newFile: null,
          localPreview: null,
          status: '',
          order: idx,
          emoji: m.emoji,
          date: m.date,
        };
      });
      setTimelineData(initialMap);
    }
  };

  const handleMemoryTextChange = (title, text) => {
    setTimelineData((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        text,
        status: '',
      },
    }));
  };

  const handleMemoryFileChange = (title, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setTimelineData((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        newFile: file,
        localPreview: previewUrl,
        status: '',
      },
    }));
  };

  const handleSaveMemory = async (title) => {
    const mem = timelineData[title];
    if (!mem) return;

    setTimelineData((prev) => ({
      ...prev,
      [title]: { ...prev[title], status: mem.newFile ? 'Uploading photo...' : 'Saving text...' },
    }));

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', mem.text || '');
    formData.append('date', mem.date || '');
    formData.append('emoji', mem.emoji || '');
    formData.append('order', mem.order !== undefined ? mem.order : 0);

    if (mem.newFile) {
      formData.append('image', mem.newFile);
      formData.append('imageDeleted', 'false');
    }

    try {
      let data;
      if (mem._id) {
        data = await updateTimelineEvent(mem._id, formData, token);
      } else {
        data = await createTimelineEvent(formData, token);
      }

      if (data && data.success && data.event) {
        setTimelineData((prev) => ({
          ...prev,
          [title]: {
            ...prev[title],
            _id: data.event._id,
            savedImage: data.event.imageUrl || prev[title].savedImage,
            imageDeleted: data.event.imageDeleted === true,
            newFile: null,
            localPreview: null,
            status: 'Saved successfully!',
          },
        }));
      } else {
        setTimelineData((prev) => ({
          ...prev,
          [title]: { ...prev[title], status: data?.message || 'Save failed' },
        }));
      }
    } catch (err) {
      console.error('Save timeline error:', err);
      setTimelineData((prev) => ({
        ...prev,
        [title]: { ...prev[title], status: 'Save failed' },
      }));
    }
  };

  const handleDeleteMemoryPhoto = async (title) => {
    const mem = timelineData[title];
    if (!mem) return;

    if (!window.confirm('Are you sure you want to delete this memory photo?\nThe photo will be permanently removed from the website.')) {
      return;
    }

    // If there is an unsaved local preview file selected:
    if (!mem.savedImage && mem.localPreview) {
      setTimelineData((prev) => ({
        ...prev,
        [title]: {
          ...prev[title],
          newFile: null,
          localPreview: null,
          status: 'New photo choice cleared',
        },
      }));
      return;
    }

    setTimelineData((prev) => ({
      ...prev,
      [title]: { ...prev[title], status: 'Deleting photo...' },
    }));

    try {
      const targetDefault = TARGET_MEMORIES.find(
        (t) => t.title.toLowerCase().trim() === title.toLowerCase().trim()
      );
      const descToPass = mem.text || targetDefault?.defaultDesc || 'Our story memory';

      let data;
      if (mem._id) {
        data = await deleteTimelineImage(mem._id, token, { title: title, description: descToPass });
      } else {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', descToPass);
        formData.append('date', targetDefault?.date || '');
        formData.append('emoji', targetDefault?.emoji || '');
        formData.append('order', targetDefault ? TARGET_MEMORIES.indexOf(targetDefault) : 0);
        formData.append('imageDeleted', 'true');
        data = await createTimelineEvent(formData, token);
      }

      if (data && data.success) {
        setTimelineData((prev) => ({
          ...prev,
          [title]: {
            ...prev[title],
            _id: data.event?._id || prev[title]._id,
            savedImage: '',
            imageDeleted: true,
            newFile: null,
            localPreview: null,
            status: 'Photo permanently deleted!',
          },
        }));
      } else {
        setTimelineData((prev) => ({
          ...prev,
          [title]: { ...prev[title], status: data?.message || 'Unable to delete photo. Please try again.' },
        }));
      }
    } catch (err) {
      console.error('Delete timeline photo error:', err);
      setTimelineData((prev) => ({
        ...prev,
        [title]: { ...prev[title], status: 'Unable to delete photo. Please try again.' },
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await loginAdmin(email, password);
      if (data && data.success && data.token) {
        setToken(data.token);
        setStoredToken(data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError(data?.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Connection error. Check if backend server is running.');
    }
  };

  const handleLogout = () => {
    setStoredToken('');
    setToken('');
    setIsLoggedIn(false);
  };

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      if (data && data.success && data.settings) {
        setHername(data.settings.hername || '');
        setBirthdayDate(data.settings.birthdayDate || '');
        setLoveStartDate(data.settings.loveStartDate || '');
      }
    } catch {}
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsStatus('Saving...');
    try {
      const data = await saveSettings({ hername, birthdayDate, loveStartDate }, token);
      setSettingsStatus(data && data.success ? 'Configurations saved!' : 'Save failed');
    } catch {
      setSettingsStatus('Save failed');
    }
  };

  const loadLetter = async () => {
    try {
      const data = await fetchLoveLetter();
      if (data && data.success && data.letter) {
        setLetterTitle(data.letter.title || '');
        setLetterMessage(data.letter.message || '');
      }
    } catch {}
  };

  const handleSaveLetter = async (e) => {
    e.preventDefault();
    setLetterStatus('Saving letter...');
    try {
      const data = await saveLoveLetter(letterTitle, letterMessage, token);
      setLetterStatus(data && data.success ? 'Love letter saved!' : 'Save failed');
    } catch {
      setLetterStatus('Save failed');
    }
  };

  const loadPhotos = async () => {
    try {
      const res = await fetchGalleryPhotos();
      if (Array.isArray(res)) {
        setPhotos(res);
      } else if (res && (res.data || res.photos)) {
        setPhotos(res.data || res.photos || []);
      }
    } catch {}
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoFile) return;
    setUploadStatus('Uploading photo...');

    const formData = new FormData();
    formData.append('images', photoFile);
    formData.append('caption', photoCaption);

    try {
      const data = await uploadGalleryPhoto(formData, token);
      if (data && data.success) {
        setUploadStatus('Photo uploaded!');
        setPhotoFile(null);
        setPhotoCaption('');
        loadPhotos();
      } else {
        setUploadStatus(data?.message || 'Upload failed');
      }
    } catch {
      setUploadStatus('Upload failed');
    }
  };

  const handleDeletePhoto = async (photo) => {
    const photoId = photo._id || photo.id;
    if (!photoId) {
      alert('Invalid photo ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    setDeletingPhotoId(photoId);
    try {
      const data = await deleteGalleryPhoto(photoId, token);
      if (data && data.success) {
        setPhotos((prev) => prev.filter((p) => (p._id || p.id) !== photoId));
      } else {
        alert(data?.message || 'Delete failed. Please try again.');
      }
    } catch (err) {
      console.error('Photo delete error:', err);
      alert('Delete failed. Please check your connection.');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const loadMusic = async () => {
    try {
      const data = await fetchMusicTrack();
      if (data && data.success && data.music) {
        setCurrentMusic(data.music);
        if (data.music.title) setSongTitle(data.music.title);
      } else {
        setCurrentMusic(null);
      }
    } catch {}
  };

  const handleUploadMusic = async (e) => {
    e.preventDefault();
    if (!musicFile) {
      setMusicStatus('Please select an audio file (MP3/WAV)');
      return;
    }
    setMusicStatus('Uploading audio track...');

    const formData = new FormData();
    formData.append('music', musicFile);
    formData.append('title', songTitle || 'Our Song');

    try {
      const data = await uploadMusicTrack(formData, token);
      if (data && data.success) {
        setMusicStatus('Background song saved!');
        setMusicFile(null);
        loadMusic();
      } else {
        setMusicStatus(data?.message || 'Upload failed');
      }
    } catch {
      setMusicStatus('Upload failed');
    }
  };

  const handleDeleteMusic = async () => {
    if (!currentMusic || !currentMusic._id) return;
    if (!window.confirm('Delete this background song?')) return;
    setMusicStatus('Deleting song...');
    try {
      const data = await deleteMusicTrack(currentMusic._id, token);
      if (data && data.success) {
        setMusicStatus('Song deleted. Default track restored');
        setCurrentMusic(null);
      } else {
        setMusicStatus(data?.message || 'Delete failed');
      }
    } catch {
      setMusicStatus('Delete failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-b from-[#1a0020] via-[#0a0010] to-black text-white">
        <div id="login-container" className="max-w-md mx-auto mt-20 p-8 rounded-3xl glass text-center">
          <div className="text-4xl mb-4 text-pink-500"><i className="fas fa-lock"></i></div>
          <h1 className="text-2xl font-bold mb-6 text-pink-500">Admin Login</h1>
          <p className="text-sm text-gray-400 mb-6">Manage your romantic birthday website content</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-medium tracking-wide hover:opacity-90 active:scale-95 transition text-white"
            >
              Login Dashboard
            </button>
            {loginError && <p className="text-xs text-red-500 text-center mt-2">{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-b from-[#1a0020] via-[#0a0010] to-black text-white">
      <div id="dashboard-container" className="max-w-4xl mx-auto rounded-3xl glass p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">SURPRISE DASHBOARD</h1>
            <p className="text-sm text-gray-400">Control your website content, music, letters, and photos dynamically</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section A: Photos Upload */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-pink-400"><i className="fas fa-camera mr-2"></i>Upload Photos to Gallery</h2>
            <p className="text-xs text-gray-400 mb-4">Choose photos to add to the timeline/gallery sections.</p>

            <form onSubmit={handleUploadPhoto} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Select Photo File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm focus:outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Photo Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="Us at the beach"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 text-white"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-pink-600 rounded-xl text-sm font-semibold hover:bg-pink-700 transition text-white">
                Upload to Gallery
              </button>
            </form>
            {uploadStatus && <div className="text-xs text-center mt-2 text-pink-400">{uploadStatus}</div>}
          </div>

          {/* Section B: Website Configuration */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400"><i className="fas fa-cog mr-2"></i>Surprise Config</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Her Nickname (e.g. Sarah)</label>
                <input
                  type="text"
                  value={hername}
                  onChange={(e) => setHername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-yellow-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Birthday Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-yellow-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Love Anniversary / Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={loveStartDate}
                  onChange={(e) => setLoveStartDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-yellow-500 text-white"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-yellow-600 rounded-xl text-sm font-semibold hover:bg-yellow-700 transition text-white">
                Save Configurations
              </button>
            </form>
            {settingsStatus && <div className="text-xs text-center mt-2 text-yellow-400">{settingsStatus}</div>}
          </div>

          {/* Section: Timeline Memories (Our Story) */}
          <div className="glass p-6 rounded-2xl md:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <div>
                <h2 className="text-xl font-semibold text-rose-400">
                  <i className="fas fa-book-open mr-2"></i>Timeline Memories (Our Story)
                </h2>
                <p className="text-xs text-gray-400">
                  Customize the text and photo for each of the 8 core memories. Uploading a photo is optional.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {TARGET_MEMORIES.map((m) => {
                const mem = timelineData[m.title] || {
                  text: m.defaultDesc,
                  savedImage: '',
                  imageDeleted: false,
                  newFile: null,
                  localPreview: null,
                  status: '',
                };
                const isDeleted = mem.imageDeleted === true && !mem.localPreview;
                const displayPhoto = mem.localPreview || (mem.savedImage ? getFullImageUrl(mem.savedImage) : null);

                return (
                  <div key={m.title} className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-pink-300">{m.title}</span>
                        <span className="text-xs text-gray-400 italic">{m.date}</span>
                      </div>

                      {/* Photo Preview */}
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center mb-3">
                        {mem.localPreview ? (
                          <img src={mem.localPreview} alt={m.title} className="w-full h-full object-cover" />
                        ) : isDeleted ? (
                          <div className="text-center p-3 text-red-400/80">
                            <i className="fas fa-eye-slash text-2xl mb-1 block"></i>
                            <span className="text-xs font-semibold">Photo Permanently Deleted</span>
                          </div>
                        ) : displayPhoto ? (
                          <img src={displayPhoto} alt={m.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-3 text-gray-500">
                            <i className="fas fa-image text-2xl mb-1 block"></i>
                            <span className="text-xs">No custom photo (Default active)</span>
                          </div>
                        )}
                        {mem.localPreview && (
                          <span className="absolute top-2 right-2 bg-pink-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow">
                            New Preview
                          </span>
                        )}
                      </div>

                      {/* Choose Photo Input & Delete Button */}
                      <div className="mb-3 space-y-2">
                        <label className="block text-xs text-gray-400">Choose New Photo (Optional)</label>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMemoryFileChange(m.title, e.target.files[0])}
                            className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700 transition"
                          />
                          {!isDeleted ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteMemoryPhoto(m.title)}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg text-xs transition whitespace-nowrap"
                            >
                              <i className="fas fa-trash-alt mr-1"></i>Delete Photo
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-1 bg-gray-800 border border-white/5 text-gray-500 rounded-lg text-xs cursor-not-allowed whitespace-nowrap"
                            >
                              Photo Deleted
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Memory Text */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Memory Text</label>
                        <textarea
                          rows={3}
                          value={mem.text}
                          onChange={(e) => handleMemoryTextChange(m.title, e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-pink-500 text-white"
                          placeholder={`Enter custom text for ${m.title}...`}
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-white/10">
                      <span className="text-xs text-pink-400 min-h-[1rem]">
                        {mem.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSaveMemory(m.title)}
                        className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl text-xs font-medium transition active:scale-95 text-white"
                      >
                        <i className="fas fa-save mr-1"></i>Save {m.title}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section C: Love Letter Message */}
          <div className="glass p-6 rounded-2xl md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-purple-400"><i className="fas fa-heart mr-2"></i>Edit Love Letter</h2>
            <form onSubmit={handleSaveLetter} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Letter Heading</label>
                <input
                  type="text"
                  placeholder="A Letter From My Heart"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Message Content</label>
                <textarea
                  rows={6}
                  value={letterMessage}
                  onChange={(e) => setLetterMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Type your beautiful letter here..."
                ></textarea>
              </div>
              <button type="submit" className="py-2.5 px-6 bg-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-700 transition text-white">
                Save Love Letter
              </button>
            </form>
            {letterStatus && <div className="text-xs text-center mt-2 text-purple-400">{letterStatus}</div>}
          </div>

          {/* Section D: Background Music / Song Add */}
          <div className="glass p-6 rounded-2xl md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-pink-400">
              <i className="fas fa-music mr-2"></i>Add / Update Background Song
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Upload custom background audio track (MP3/WAV) to play automatically across the website.
            </p>

            <form onSubmit={handleUploadMusic} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Select Audio File (MP3 / WAV)</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setMusicFile(e.target.files[0])}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Song Title</label>
                  <input
                    type="text"
                    placeholder="Our Song"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-500 text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-2.5 px-6 bg-pink-600 rounded-xl text-sm font-semibold hover:bg-pink-700 transition text-white"
              >
                Upload Song
              </button>
            </form>
            {musicStatus && <div className="text-xs text-center mt-2 text-pink-400">{musicStatus}</div>}

            {/* Current Active Background Song Preview */}
            {currentMusic && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-pink-400"><i className="fas fa-music mr-1"></i> Active Song: {currentMusic.title || 'Our Song'}</div>
                  <audio controls crossOrigin="anonymous" src={getFullImageUrl(currentMusic.musicUrl)} className="mt-2 h-8 w-full max-w-md" />
                </div>
                <button
                  type="button"
                  onClick={handleDeleteMusic}
                  className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-lg text-xs transition"
                >
                  <i className="fas fa-trash-alt mr-1"></i>Delete Track
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Photos List */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-400"><i className="fas fa-images mr-2"></i>Uploaded Photos ({photos.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((photo, i) => {
              const pId = photo._id || photo.id || i;
              const isDeleting = deletingPhotoId === pId;
              return (
                <div key={pId} className="rounded-xl overflow-hidden glass border border-white/10 flex flex-col justify-between">
                  <div className="relative aspect-square overflow-hidden bg-black/30">
                    <img
                      src={getFullImageUrl(photo.imageUrl || photo.url || photo.src)}
                      alt={photo.caption || 'Uploaded'}
                      crossOrigin="anonymous"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 flex flex-col gap-1.5 bg-black/40 border-t border-white/5">
                    {photo.caption && (
                      <p className="text-xs text-gray-300 truncate text-center" title={photo.caption}>
                        {photo.caption}
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeletePhoto(photo)}
                      className="w-full py-1.5 px-3 border border-red-500/40 text-red-400 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-trash-alt"></i>
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
