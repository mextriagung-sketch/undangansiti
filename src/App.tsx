/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Music, 
  Volume2, 
  VolumeX, 
  ChevronDown,
  Send,
  Share2,
  Check
} from 'lucide-react';

const COUNTDOWN_TARGET = new Date('2026-04-04T08:00:00').getTime();

const FallingHearts = () => {
  const hearts = Array.from({ length: 40 });
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -50, 
            left: `${Math.random() * 100}%`, 
            opacity: 0,
            scale: Math.random() * 0.6 + 0.4,
            rotate: 0
          }}
          animate={{ 
            top: '110%',
            opacity: [0, 0.7, 0.7, 0],
            rotate: Math.random() * 720 - 360,
            x: [0, Math.random() * 150 - 75, 0]
          }}
          transition={{ 
            duration: Math.random() * 8 + 7, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 15
          }}
          className="absolute text-rose-400 drop-shadow-sm"
        >
          <Heart fill="currentColor" className="w-4 h-4 md:w-7 md:h-7" />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isCopied, setIsCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Ganti URL ini dengan link musik MP3 Anda
  const MUSIC_URL = "https://www.dropbox.com/scl/fi/z6f4xlemuymfhsws0xp1z/Tiara-Andini-Arsy-Widianto-Lagu-Pernikahan-Kita.mp3?rlkey=9or91f1qjeqvvi23mxbcnbxw7&st=xac094j5&dl=1";

  useEffect(() => {
    if (audioRef.current) {
      if (!isMuted && isOpen) {
        audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = COUNTDOWN_TARGET - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsMuted(false);
  };

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpStatus('submitting');
    setTimeout(() => setRsvpStatus('success'), 1500);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Undangan Pernikahan Siti & Adi',
      text: 'Kami mengundang Anda untuk hadir di pernikahan Siti Aisyah & Adi Saputra pada 04 April 2026.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden selection:bg-rose-100 selection:text-rose-900">
      {/* Cover Page */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfbf7] text-center p-6"
            style={{
              backgroundImage: `linear-gradient(rgba(253, 251, 247, 0.8), rgba(253, 251, 247, 0.8)), url('https://picsum.photos/seed/wedding-bg/1920/1080?blur=10')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="space-y-6"
            >
              <span className="text-sm tracking-[0.3em] uppercase font-medium text-rose-800">The Wedding of</span>
              <h1 className="text-6xl md:text-8xl font-display text-rose-900 italic">Aisyah & Adi</h1>
              <div className="w-12 h-px bg-rose-300 mx-auto"></div>
              <p className="text-lg font-serif italic text-gray-600">Sabtu, 04 April 2026</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInvitation}
                className="mt-8 px-8 py-3 bg-rose-800 text-white rounded-full shadow-lg hover:bg-rose-900 transition-colors flex items-center gap-2 mx-auto"
              >
                <Heart className="w-4 h-4" />
                Buka Undangan
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {isOpen && <FallingHearts />}
        {/* Floating Buttons */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <button 
            onClick={handleShare}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-rose-800 hover:bg-rose-50 transition-colors relative group"
          >
            {isCopied ? <Check className="w-6 h-6 text-green-600" /> : <Share2 className="w-6 h-6" />}
            {isCopied && (
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                Link Tersalin!
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-rose-800 hover:bg-rose-50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src="https://picsum.photos/seed/wedding-flowers/1920/1080" 
              alt="Wedding Background" 
              className="w-full h-full object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="relative z-10 space-y-8 px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-xl tracking-[0.4em] uppercase font-light text-rose-800 mb-4">Walimatul 'Ursy</h2>
              <h1 className="text-7xl md:text-9xl font-display text-rose-900 mb-6">Siti Aisyah <br/> & <br/> Adi Saputra</h1>
              <p className="text-2xl font-serif italic text-gray-700">04 . 04 . 2026</p>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <ChevronDown className="w-8 h-8 text-rose-300" />
            </motion.div>
          </div>
        </section>

        {/* Quran Verse */}
        <section className="py-24 px-6 bg-white text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <Heart className="w-8 h-8 text-rose-200 mx-auto" />
            <p className="text-xl font-serif italic text-gray-600 leading-relaxed">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <p className="text-sm font-bold text-rose-800 uppercase tracking-widest">( Ar-Rum: 21 )</p>
          </motion.div>
        </section>

        {/* Couple Section */}
        <section className="py-24 px-6 bg-[#fdfbf7]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center text-center">
            {/* Bride */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-4xl font-display text-rose-900">Siti Aisyah</h3>
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-widest text-rose-800 font-semibold">Putri Dari</p>
                <p className="text-lg font-serif">Bpk. Subakir & Ibu Trian</p>
              </div>
            </motion.div>

            {/* Groom */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-4xl font-display text-rose-900">Adi Saputra</h3>
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-widest text-rose-800 font-semibold">Putra Dari</p>
                <p className="text-lg font-serif">Bpk. Dirin & Ibu Rohimah</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-20 bg-rose-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-2xl font-serif italic mb-10 text-rose-100">Menuju Hari Bahagia</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Hari', value: timeLeft.days },
                { label: 'Jam', value: timeLeft.hours },
                { label: 'Menit', value: timeLeft.minutes },
                { label: 'Detik', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-8">
                  <span className="block text-3xl md:text-5xl font-display mb-2">{item.value}</span>
                  <span className="text-xs md:text-sm uppercase tracking-widest opacity-70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display text-rose-900 mb-4">Acara Pernikahan</h2>
              <div className="w-24 h-px bg-rose-200 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Akad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#fdfbf7] p-10 rounded-3xl border border-rose-100 text-center space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-800">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-display text-rose-900">Akad Nikah</h3>
                <div className="space-y-4 text-gray-600 font-serif text-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Sabtu, 04 April 2026</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>08:00 WIB - Selesai</span>
                  </div>
                  <div className="flex items-start justify-center gap-2 pt-4">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-rose-800" />
                    <p className="max-w-[200px]">Desa Ringin Agung p9a, RT 05 Dusun 2</p>
                  </div>
                </div>
              </motion.div>

              {/* Resepsi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#fdfbf7] p-10 rounded-3xl border border-rose-100 text-center space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-800">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-display text-rose-900">Resepsi</h3>
                <div className="space-y-4 text-gray-600 font-serif text-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Sabtu, 04 April 2026</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>08:00 WIB - Selesai</span>
                  </div>
                  <div className="flex items-start justify-center gap-2 pt-4">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-rose-800" />
                    <p className="max-w-[200px]">Desa Ringin Agung p9a, RT 05 Dusun 2</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="py-12 px-6 bg-[#fdfbf7]">
          <div className="max-w-5xl mx-auto h-96 bg-gray-200 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="text-center text-white space-y-4">
                <MapPin className="w-12 h-12 mx-auto" />
                <p className="text-xl font-medium">Lokasi Acara</p>
                <button className="px-6 py-2 bg-rose-800 rounded-full text-sm hover:bg-rose-900 transition-colors">
                  Buka Google Maps
                </button>
              </div>
            </div>
            <img 
              src="https://picsum.photos/seed/map-placeholder/1200/600" 
              alt="Map Placeholder" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* RSVP Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-2xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-display text-rose-900">Konfirmasi Kehadiran</h2>
              <p className="text-gray-600 font-serif italic">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
            </div>

            {rsvpStatus === 'success' ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 p-8 rounded-3xl border border-green-100"
              >
                <Heart className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-2xl font-display text-green-800 mb-2">Terima Kasih!</h4>
                <p className="text-green-700">Pesan Anda telah kami terima.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleRSVP} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-rose-800 ml-1">Nama Lengkap</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Masukkan nama Anda"
                    className="w-full px-6 py-4 rounded-2xl bg-[#fdfbf7] border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-rose-800 ml-1">Kehadiran</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-[#fdfbf7] border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all">
                    <option>Hadir</option>
                    <option>Tidak Hadir</option>
                    <option>Masih Ragu</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-rose-800 ml-1">Pesan / Doa</label>
                  <textarea 
                    rows={4}
                    placeholder="Tuliskan ucapan selamat & doa restu"
                    className="w-full px-6 py-4 rounded-2xl bg-[#fdfbf7] border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all resize-none"
                  ></textarea>
                </div>
                <button 
                  disabled={rsvpStatus === 'submitting'}
                  className="w-full py-4 bg-rose-800 text-white rounded-2xl font-bold tracking-widest uppercase hover:bg-rose-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {rsvpStatus === 'submitting' ? 'Mengirim...' : (
                    <>
                      Kirim Konfirmasi
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 bg-[#fdfbf7] text-center border-t border-rose-100">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <h2 className="text-4xl font-display text-rose-900 italic">Siti & Adi</h2>
            <p className="text-gray-500 font-serif italic">Sampai jumpa di hari bahagia kami!</p>
            <div className="pt-8 border-t border-rose-100 flex flex-col md:flex-row items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] text-gray-400">
              <span>© 2026 Mextri Computer. 082279088423||Cetak undangan|Pembuatan Undangan Web|Pembuatan Vidio Undangan </span>
              <span className="hidden md:block">•</span>
              <span>Made with Love</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Audio Element */}
      <audio 
        ref={audioRef}
        src={MUSIC_URL}
        loop
      />
    </div>
  );
}
