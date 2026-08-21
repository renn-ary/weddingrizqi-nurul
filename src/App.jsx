import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WEDDING_DATE = new Date('2026-09-19T10:00:00')
const WEDDING_LOCATION = 'Masjid Agung Jawa Tengah, Semarang'
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Masjid+Agung+Jawa+Tengah+Semarang'
const BNI_NUMBER = '1234567890'
const BCA_NUMBER = '0987654321'
const BNI_HOLDER = 'Rizqi Pratama'
const BCA_HOLDER = 'Nurul Aisyah'

function useCountdown(targetDate) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}

function useGuestName() {
  const [name, setName] = useState('Nama Tamu')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    if (to) {
      setName(decodeURIComponent(to.replace(/\+/g, ' ')))
    }
  }, [])
  return name
}

function CopySuccessToast({ show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="toast-success"
          onAnimationComplete={() => {
            setTimeout(onClose, 2000)
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          </svg>
          Berhasil disalin!
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MusicPlayer({ isPlaying, toggle }) {
  const audioRef = useRef(null)
  const [audioReady, setAudioReady] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleCanPlay = () => setAudioReady(true)
    audio.addEventListener('canplay', handleCanPlay)
    return () => audio.removeEventListener('canplay', handleCanPlay)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioReady) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, audioReady])

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src={`${import.meta.env.BASE_URL}Assets/Audio/wedding.mp3`}
      />
      <div
        className={`music-player ${isPlaying ? 'playing' : ''}`}
        onClick={toggle}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#8B1E2D">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#8B1E2D">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </div>
    </>
  )
}

function NavigationDots({ currentPage, totalPages, onNavigate, showNav }) {
  if (!showNav) return null
  return (
    <div className="nav-dots">
      {Array.from({ length: totalPages }, (_, i) => (
        <motion.div
          key={i}
          className={`nav-dot ${currentPage === i ? 'active' : ''}`}
          onClick={() => onNavigate(i)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        />
      ))}
    </div>
  )
}

function Sparkles({ count = 20 }) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 4 + 2
  }))
  return (
    <>
      {sparkles.map(s => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}
    </>
  )
}

function CoverPage({ guestName, onOpen }) {
  return (
    <motion.div
      className="page-container"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}Assets/Image/covermempelai.jpeg')`,        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        minHeight: '100vh',
        width: '100%'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1
        }}
      />
      <Sparkles count={30} />
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 'calc(60vh - 40px)',
          paddingLeft: '20px',
          paddingRight: '20px',
          textAlign: 'center',
          color: 'white'
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.div
          className="font-libre-franklin"
          style={{
            fontSize: '14px',
            letterSpacing: '6px',
            marginBottom: '16px',
            color: '#D8C3A5',
            textTransform: 'uppercase'
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          The Wedding Of
        </motion.div>

        <motion.h1
          className="font-anthela"
          style={{
            fontSize: 'clamp(48px, 12vw, 80px)',
            lineHeight: 1.1,
            marginBottom: '20px',
            color: '#8B1E2D',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
        >
          Rizqi & Nurul
        </motion.h1>

        <div className="decorative-line" style={{ background: 'linear-gradient(90deg, transparent, #D8C3A5, transparent)' }} />

        <motion.p
          className="font-libre-franklin"
          style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px', marginBottom: '4px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.2 }}
        >
          Dear :
        </motion.p>

        <motion.p
          className="font-playfair"
          style={{
            fontSize: 'clamp(20px, 5vw, 28px)',
            color: '#D8C3A5',
            marginBottom: '32px',
            fontWeight: 500
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          {guestName}
        </motion.p>

        <motion.button
          className="btn-primary"
          onClick={onOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.6 },
            y: { delay: 1.6, repeat: Infinity, duration: 2 }
          }}
          style={{ position: 'relative', zIndex: 10 }}
        >
          Buka Undangan
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function CountdownPage({ countdown }) {
  const items = [
    { label: 'Hari', value: countdown.days },
    { label: 'Jam', value: countdown.hours },
    { label: 'Menit', value: countdown.minutes },
    { label: 'Detik', value: countdown.seconds }
  ]

  return (
    <motion.div
      className="page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        backgroundImage: `url('${import.meta.env.BASE_URL}Assets/Image/backgound.jfif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(248,247,245,0.88) 0%, rgba(241,233,223,0.9) 50%, rgba(232,220,203,0.88) 100%)', zIndex: 0 }} />
      <Sparkles count={15} />

      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ textAlign: 'center', transformStyle: 'preserve-3d', position: 'relative', zIndex: 1 }}
      >
        <p className="font-poppins" style={{ fontSize: '13px', letterSpacing: '5px', color: '#6B6B6B', textTransform: 'uppercase', marginBottom: '8px' }}>
          Save The Date
        </p>
        <h2 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(44px, 11vw, 64px)', marginBottom: '8px', fontWeight: 400 }}>
          Menuju Bahagia
        </h2>
        <div className="decorative-line" />
        <p className="font-playfair" style={{ fontSize: 'clamp(18px, 4.5vw, 22px)', color: '#252525', marginBottom: '8px', marginTop: '8px' }}>
          15 Juni 2025
        </p>
        <p className="font-poppins" style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '48px' }}>
          Minggu • 10.00 WIB
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="countdown-box card-3d"
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, rotateX: -90, z: -100 }}
            animate={{ opacity: 1, rotateX: 0, z: 0 }}
            transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <motion.p
              className="font-playfair gradient-gold"
              style={{ fontSize: 'clamp(28px, 7vw, 42px)', fontWeight: 700, lineHeight: 1 }}
              key={item.value}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {String(item.value).padStart(2, '0')}
            </motion.p>
            <p className="font-poppins" style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '8px' }}>
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        style={{ marginTop: '48px', textAlign: 'center', position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="font-poppins" style={{ fontSize: '14px', color: '#6B6B6B', maxWidth: '320px', lineHeight: 1.8 }}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya..."
        </p>
        <p className="font-playfair" style={{ fontSize: '13px', color: '#8B1E2D', marginTop: '12px', fontStyle: 'italic' }}>
          — Ar-Rum: 21
        </p>
      </motion.div>
    </motion.div>
  )
}

function DoaPage() {
  return (
    <motion.div
      className="page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        backgroundImage: `url('${import.meta.env.BASE_URL}Assets/Image/backgound.jfif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(241,233,223,0.9) 0%, rgba(244,217,196,0.92) 50%, rgba(237,213,187,0.9) 100%)', zIndex: 0 }} />
      <Sparkles count={12} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          className="ornament floating-animation"
          style={{ fontSize: '40px', marginBottom: '8px' }}
        >
          🌸
        </motion.div>
        <p className="font-poppins" style={{ fontSize: '13px', letterSpacing: '5px', color: '#8B1E2D', textTransform: 'uppercase', marginBottom: '8px' }}>
          Doa Pengantin
        </p>
        <h2 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(40px, 10vw, 56px)', marginBottom: '8px', fontWeight: 400 }}>
          Berkah Suci
        </h2>
        <div className="decorative-line" />
      </motion.div>

      <motion.div
        style={{
          marginTop: '40px',
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '32px 24px',
          border: '1px solid #D8C3A5',
          boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 1
        }}
        className="card-3d"
        initial={{ opacity: 0, rotateY: 45, x: 100 }}
        animate={{ opacity: 1, rotateY: 0, x: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p className="font-playfair" style={{ fontSize: '28px', color: '#8B1E2D', direction: 'rtl', lineHeight: 2 }}>
            بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-poppins" style={{ fontSize: '13px', color: '#6B6B6B', fontStyle: 'italic', textAlign: 'center', marginBottom: '16px' }}>
            "Semoga Allah memberkahimu dan memberkahi atasmu, serta semoga Allah mengumpulkan kalian berdua dalam kebaikan."
          </p>
          <p className="font-playfair" style={{ fontSize: '12px', color: '#8B1E2D', textAlign: 'right', marginBottom: '24px' }}>
            — HR. Abu Dawud, Tirmidzi
          </p>
        </motion.div>

        <div style={{ borderTop: '1px dashed rgba(216, 195, 165, 0.7)', paddingTop: '24px' }}>
          <p className="font-poppins" style={{ fontSize: '14px', color: '#252525', textAlign: 'center', lineHeight: 1.9 }}>
            Dengan segala kerendahan hati, kami mohon do'a restu Bapak/Ibu/Saudara/i,
            agar pernikahan kami senantiasa dilimpahi keberkahan, kebahagiaan,
            dan ketenangan dunia serta akhirat. Aamiin Ya Rabbal 'Alamin.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MempelaiPage() {
  const mempelai = [
    {
      title: 'Mempelai Pria',
      name: 'Rizqi Pratama, S.Kom',
      parent: 'Putra dari Bapak Haji Ahmad Pratama & Ibu Hajah Siti Aminah',
      emoji: '🤵',
      gradient: 'linear-gradient(135deg, #8B1E2D 0%, #681520 100%)'
    },
    {
      title: 'Mempelai Wanita',
      name: 'Nurul Aisyah, S.Pd',
      parent: 'Putri dari Bapak Drs. Hadi Wijaya & Ibu Hj. Yulianti',
      emoji: '👰',
      gradient: 'linear-gradient(135deg, #A52A3A 0%, #D8C3A5 100%)'
    }
  ]

  return (
    <motion.div
      className="page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        backgroundImage: `url('${import.meta.env.BASE_URL}Assets/Image/backgound.jfif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(248,247,245,0.88) 0%, rgba(241,233,223,0.9) 50%, rgba(232,220,203,0.88) 100%)', zIndex: 0 }} />
      <Sparkles count={15} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}
      >
        <p className="font-poppins" style={{ fontSize: '13px', letterSpacing: '5px', color: '#6B6B6B', textTransform: 'uppercase', marginBottom: '8px' }}>
          Calon Pengantin
        </p>
        <h2 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(40px, 10vw, 56px)', marginBottom: '8px', fontWeight: 400 }}>
          Kedua Mempelai
        </h2>
        <div className="decorative-line" />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {mempelai.map((m, i) => (
          <motion.div
            key={m.name}
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 16px 56px rgba(0,0,0,0.1)',
              border: '1px solid #D8C3A5',
              transformStyle: 'preserve-3d',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="card-3d"
            initial={{ opacity: 0, x: i === 0 ? -100 : 100, rotateY: i === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.4 + i * 0.2, type: 'spring', stiffness: 80 }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: m.gradient
              }}
            />
            <motion.div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                background: m.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
              }}
              animate={{ rotateY: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
            >
              {m.emoji}
            </motion.div>

            <p className="font-poppins" style={{ fontSize: '12px', letterSpacing: '4px', color: '#6B6B6B', textTransform: 'uppercase', marginBottom: '8px' }}>
              {m.title}
            </p>
            <h3 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(26px, 6.5vw, 32px)', marginBottom: '12px', fontWeight: 400 }}>
              {m.name}
            </h3>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #D8C3A5, transparent)', margin: '0 auto 16px' }} />
            <p className="font-poppins" style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.7 }}>
              {m.parent}
            </p>
          </motion.div>
        ))}

        <motion.div
          style={{ textAlign: 'center', padding: '8px 0', position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
        >
          <div className="font-great-vibes" style={{ fontSize: '48px', color: '#8B1E2D' }}>&</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function AcaraPage() {
  const acara = [
    {
      icon: '💍',
      title: 'Akad Nikah',
      date: 'Minggu, 15 Juni 2025',
      time: '08.00 - 10.00 WIB',
      place: 'Masjid Agung Jawa Tengah'
    },
    {
      icon: '🎉',
      title: 'Resepsi Pernikahan',
      date: 'Minggu, 15 Juni 2025',
      time: '11.00 - 15.00 WIB',
      place: 'Grand Ballroom, Hotel Sido Mukti'
    }
  ]

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Lokasi Pernikahan Rizqi & Nurul',
        text: `Undangan Pernikahan - Lokasi: ${WEDDING_LOCATION}`,
        url: MAPS_URL
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(MAPS_URL).then(() => {
        alert('Link Google Maps berhasil disalin!')
      })
    }
  }

  return (
    <motion.div
      className="page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        backgroundImage: `url('${import.meta.env.BASE_URL}Assets/Image/backgound.jfif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(241,233,223,0.9) 0%, rgba(244,217,196,0.92) 50%, rgba(237,213,187,0.9) 100%)', zIndex: 0 }} />
      <Sparkles count={12} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}
      >
        <p className="font-poppins" style={{ fontSize: '13px', letterSpacing: '5px', color: '#8B1E2D', textTransform: 'uppercase', marginBottom: '8px' }}>
          Rangkaian Acara
        </p>
        <h2 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(40px, 10vw, 56px)', marginBottom: '8px', fontWeight: 400 }}>
          Waktu & Tempat
        </h2>
        <div className="decorative-line" />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '420px', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
        {acara.map((a, i) => (
          <motion.div
            key={a.title}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '28px 24px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
              border: '1px solid #D8C3A5',
              transformStyle: 'preserve-3d'
            }}
            className="card-3d"
            initial={{ opacity: 0, y: 50, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.4 + i * 0.2, type: 'spring', stiffness: 80 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <motion.div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #F1E9DF 0%, #D8C3A5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
              >
                {a.icon}
              </motion.div>
              <div style={{ flex: 1 }}>
                <h3 className="font-playfair" style={{ fontSize: '18px', color: '#252525', marginBottom: '6px', fontWeight: 600 }}>
                  {a.title}
                </h3>
                <p className="font-poppins" style={{ fontSize: '13px', color: '#8B1E2D', fontWeight: 500, marginBottom: '4px' }}>
                  {a.date}
                </p>
                <p className="font-poppins" style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '4px' }}>
                  ⏰ {a.time}
                </p>
                <p className="font-poppins" style={{ fontSize: '13px', color: '#3A3A3A' }}>
                  📍 {a.place}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 16px 56px rgba(0,0,0,0.15)',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=..."
          width="100%"
          height="200"
          style={{ border: 0, display: 'block' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        />
      </motion.div>

      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        <motion.button
          className="btn-primary"
          style={{ flex: 1, padding: '14px 20px', fontSize: '14px' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.open(MAPS_URL, '_blank')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          🗺️ Buka Maps
        </motion.button>
        <motion.button
          className="btn-gift"
          style={{ flex: 1, padding: '14px 20px', fontSize: '14px' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShareLocation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          📤 Bagikan
        </motion.button>
      </div>
    </motion.div>
  )
}

function GiftPage({ onCopy }) {
  const banks = [
    {
      name: 'Bank BNI',
      number: BNI_NUMBER,
      holder: BNI_HOLDER,
      logo: '🏦',
      color: '#8B1E2D',
      bgGradient: 'linear-gradient(135deg, #8B1E2D 0%, #681520 100%)'
    },
    {
      name: 'Bank BCA',
      number: BCA_NUMBER,
      holder: BCA_HOLDER,
      logo: '💳',
      color: '#681520',
      bgGradient: 'linear-gradient(135deg, #A52A3A 0%, #8B1E2D 100%)'
    }
  ]

  return (
    <motion.div
      className="page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        backgroundImage: `url('${import.meta.env.BASE_URL}Assets/Image/backgound.jfif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(248,247,245,0.88) 0%, rgba(241,233,223,0.9) 50%, rgba(232,220,203,0.88) 100%)', zIndex: 0 }} />
      <Sparkles count={15} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          className="floating-animation"
          style={{ fontSize: '40px', marginBottom: '8px' }}
        >
          🎁
        </motion.div>
        <p className="font-poppins" style={{ fontSize: '13px', letterSpacing: '5px', color: '#6B6B6B', textTransform: 'uppercase', marginBottom: '8px' }}>
          Wedding Gift
        </p>
        <h2 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(40px, 10vw, 56px)', marginBottom: '8px', fontWeight: 400 }}>
          Kado Bahagia
        </h2>
        <div className="decorative-line" />
        <motion.p
          className="font-poppins"
          style={{ fontSize: '13px', color: '#6B6B6B', maxWidth: '360px', lineHeight: 1.8, marginTop: '16px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sebagai ungkapan tanda kasih sayang Anda kepada kedua mempelai,
          dapat diberikan melalui transfer ke rekening berikut:
        </motion.p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {banks.map((bank, i) => (
          <motion.div
            key={bank.name}
            className="bank-card"
            initial={{ opacity: 0, x: i === 0 ? -100 : 100, rotateZ: i === 0 ? -5 : 5 }}
            animate={{ opacity: 1, x: 0, rotateZ: 0 }}
            transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: bank.bgGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                }}
              >
                {bank.logo}
              </div>
              <div>
                <h3 className="font-playfair" style={{ fontSize: '20px', color: '#252525', fontWeight: 600 }}>
                  {bank.name}
                </h3>
                <p className="font-poppins" style={{ fontSize: '12px', color: '#6B6B6B' }}>
                  a.n. <span className="font-anthela" style={{ fontSize: '18px', color: '#8B1E2D' }}>{bank.holder}</span>
                </p>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #F8F7F5 0%, #F1E9DF 100%)',
                borderRadius: '12px',
                padding: '16px 20px',
                border: '1px dashed #D8C3A5',
                marginBottom: '16px'
              }}
            >
              <p className="font-poppins" style={{ fontSize: '11px', color: '#6B6B6B', marginBottom: '4px' }}>
                Nomor Rekening
              </p>
              <p
                className="font-playfair"
                style={{
                  fontSize: 'clamp(20px, 5.5vw, 24px)',
                  color: bank.color,
                  fontWeight: 700,
                  letterSpacing: '2px'
                }}
              >
                {bank.number.match(/.{1,4}/g).join(' ')}
              </p>
            </div>

            <motion.button
              className="btn-gift"
              style={{ width: '100%', padding: '14px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigator.clipboard.writeText(bank.number).then(() => {
                  onCopy()
                })
              }}
            >
              📋 Salin Nomor Rekening
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="font-poppins"
        style={{
          marginTop: '36px',
          fontSize: '12px',
          color: '#6B6B6B',
          textAlign: 'center',
          maxWidth: '360px',
          lineHeight: 1.8,
          fontStyle: 'italic'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        "Kehadiran serta do'a Anda adalah karunia terbesar bagi kami.
        Jika berkenan memberikan kado, akan sangat meringankan beban kami
        dalam membina rumah tangga. Terima kasih atas kasih sayangnya." 💛
      </motion.p>
    </motion.div>
  )
}

function GalleryPage() {
  const images = [
  `${import.meta.env.BASE_URL}Assets/Image/covermempelai.jpeg`,
  `${import.meta.env.BASE_URL}Assets/Image/gallery.jpeg`,
  `${import.meta.env.BASE_URL}Assets/Image/gallery1.jpeg`,
  `${import.meta.env.BASE_URL}Assets/Image/gallery2.jpeg`,
  `${import.meta.env.BASE_URL}Assets/Image/gallery3.jpeg`
]

  return (
    <motion.div
      className="page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 24px',
        position: 'relative',
        backgroundImage: `url('${import.meta.env.BASE_URL}Assets/Image/backgound.jfif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(241,233,223,0.9) 0%, rgba(244,217,196,0.92) 50%, rgba(237,213,187,0.9) 100%)', zIndex: 0 }} />
      <Sparkles count={12} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          className="floating-animation"
          style={{ fontSize: '40px', marginBottom: '8px' }}
        >
          📸
        </motion.div>
        <p className="font-poppins" style={{ fontSize: '13px', letterSpacing: '5px', color: '#8B1E2D', textTransform: 'uppercase', marginBottom: '8px' }}>
          Galeri Cerita
        </p>
        <h2 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(40px, 10vw, 56px)', marginBottom: '8px', fontWeight: 400 }}>
          Kenangan Kami
        </h2>
        <div className="decorative-line" />
      </motion.div>

      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {images.map((img, i) => {
          const isLarge = i === 0
          return (
            <motion.div
              key={i}
              style={{
                gridColumn: isLarge ? 'span 2' : 'span 1',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                transformStyle: 'preserve-3d',
                aspectRatio: isLarge ? '16 / 10' : '1 / 1',
                position: 'relative',
                cursor: 'pointer'
              }}
              className="gallery-image"
              initial={{ opacity: 0, scale: 0.5, rotate: i % 2 === 0 ? -10 : 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.4 + i * 0.15,
                type: 'spring',
                stiffness: 80
              }}
              whileHover={{ scale: 1.03, rotateY: 3, rotateX: -3 }}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.2) 100%)',
                  pointerEvents: 'none'
                }}
              />
            </motion.div>
          )
        })}
      </div>

      <motion.div
        style={{
          marginTop: '16px',
          textAlign: 'center',
          maxWidth: '360px',
          position: 'relative',
          zIndex: 1
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p className="font-poppins" style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.9, fontStyle: 'italic' }}>
          "Setiap foto adalah kenangan yang telah membekas,
          menjadi saksi perjalanan cinta kami menuju hari bahagia."
        </p>
      </motion.div>
    </motion.div>
  )
}

function PenutupPage() {
  return (
    <motion.div
      className="page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        background: 'linear-gradient(180deg, #252525 0%, #3A1520 35%, #681520 70%, #252525 100%)',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Sparkles count={40} />

      <motion.div
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#D8C3A5',
              borderRadius: '50%',
              boxShadow: '0 0 6px #D8C3A5, 0 0 12px #A52A3A',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </motion.div>

      <motion.div
        style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ marginBottom: '20px', display: 'inline-block' }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" stroke="#D8C3A5" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M30 18 L34 28 L44 28 L36 35 L39 45 L30 39 L21 45 L24 35 L16 28 L26 28 Z" fill="#8B1E2D" opacity="0.95" stroke="#D8C3A5" strokeWidth="0.5" />
          </svg>
        </motion.div>

        <p className="font-poppins" style={{ fontSize: '13px', letterSpacing: '5px', color: '#D8C3A5', textTransform: 'uppercase', marginBottom: '12px', opacity: 0.9 }}>
          Terima Kasih
        </p>
        <h2 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(44px, 11vw, 68px)', marginBottom: '8px', fontWeight: 400 }}>
          Atas Kehadiran
        </h2>
        <div className="decorative-line" />
      </motion.div>

      <motion.div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '36px',
          maxWidth: '380px',
          textAlign: 'center'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="font-poppins" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9 }}>
          Dengan segala kerendahan hati, kami ucapkan terima kasih yang sebesar-besarnya
          atas do'a, restu, dan kehadiran Bapak/Ibu/Saudara/i dalam momen bahagia ini.
          Semoga kebaikan Anda dibalas dengan keberkahan yang berlipat ganda oleh Allah SWT.
        </p>
      </motion.div>

      <motion.div
        style={{ position: 'relative', zIndex: 1, marginTop: '40px', textAlign: 'center' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring' }}
      >
        <p className="font-poppins" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', letterSpacing: '3px' }}>
          KAMI YANG BERBAHAGIA
        </p>
        <h3 className="font-anthela gradient-gold" style={{ fontSize: 'clamp(36px, 9vw, 52px)', marginBottom: '4px', fontWeight: 400 }}>
          Rizqi & Nurul
        </h3>
        <p className="font-playfair" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
          beserta segenap keluarga besar
        </p>
      </motion.div>

      <motion.div
        style={{ position: 'relative', zIndex: 1, marginTop: '48px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div
          style={{
            padding: '14px 28px',
            border: '1px solid rgba(216, 195, 165, 0.6)',
            borderRadius: '50px',
            background: 'rgba(139, 30, 45, 0.25)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <p className="font-playfair" style={{ color: '#D8C3A5', fontSize: '14px', textAlign: 'center', letterSpacing: '2px' }}>
            Wassalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
        </div>
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '24px',
          width: '100%',
          textAlign: 'center',
          zIndex: 1
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <p className="font-poppins" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
          © 2025 • Wedding Invitation by ❤️
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isCoverOpen, setIsCoverOpen] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const guestName = useGuestName()
  const countdown = useCountdown(WEDDING_DATE)

  const totalPages = 8

  const handleOpenInvitation = () => {
    setIsCoverOpen(true)
    setMusicEnabled(true)
    setIsMusicPlaying(true)
    setTimeout(() => {
      setCurrentPage(1)
    }, 1200)
  }

  const navigateTo = (page) => {
    if (page >= 0 && page < totalPages) {
      if (page === 0) {
        setCurrentPage(0)
        setIsCoverOpen(false)
        setIsMusicPlaying(false)
        setMusicEnabled(false)
      } else {
        if (!isCoverOpen) setIsCoverOpen(true)
        setCurrentPage(page)
      }
    }
  }

  useEffect(() => {
    const handleWheel = (e) => {
      if (!isCoverOpen) return
      if (e.deltaY > 30 && currentPage < totalPages - 1) {
        navigateTo(currentPage + 1)
      } else if (e.deltaY < -30 && currentPage > 0) {
        navigateTo(currentPage - 1)
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchEnd = (e) => {
      if (!isCoverOpen) return
      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY
      if (Math.abs(diff) > 60) {
        if (diff > 0 && currentPage < totalPages - 1) {
          navigateTo(currentPage + 1)
        } else if (diff < 0 && currentPage > 0) {
          navigateTo(currentPage - 1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentPage, isCoverOpen])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsMusicPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const handleCopy = () => {
    setShowCopyToast(true)
  }

  const toggleMusic = () => {
    if (!musicEnabled) setMusicEnabled(true)
    setIsMusicPlaying(p => !p)
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {musicEnabled && (
        <MusicPlayer isPlaying={isMusicPlaying} toggle={toggleMusic} />
      )}

      <NavigationDots
        currentPage={currentPage}
        totalPages={totalPages}
        onNavigate={navigateTo}
        showNav={isCoverOpen && currentPage !== 0}
      />

      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          {currentPage === 0 && (
            <motion.div
              key="cover"
              initial={isCoverOpen ? { y: 0, rotateX: 0, opacity: 1 } : { y: 0, rotateX: 0, opacity: 1 }}
              animate={isCoverOpen
                ? { y: '-100vh', rotateX: -15, opacity: 0.5 }
                : { y: 0, rotateX: 0, opacity: 1 }
              }
              transition={isCoverOpen
                ? { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
              }
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d'
              }}
            >
              <CoverPage guestName={guestName} onOpen={handleOpenInvitation} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentPage === 1 && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -100 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <CountdownPage countdown={countdown} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentPage === 2 && (
            <motion.div
              key="doa"
              initial={{ opacity: 0, rotateY: 90, x: 200 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -90, x: -200 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <DoaPage />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentPage === 3 && (
            <motion.div
              key="mempelai"
              initial={{ opacity: 0, rotateX: 45, y: 200 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -45, y: -200 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <MempelaiPage />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentPage === 4 && (
            <motion.div
              key="acara"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <AcaraPage />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentPage === 5 && (
            <motion.div
              key="gift"
              initial={{ opacity: 0, x: -300, skewX: 10 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              exit={{ opacity: 0, x: 300, skewX: -10 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <GiftPage onCopy={handleCopy} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentPage === 6 && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, rotate: -5, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 5, scale: 0.8 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <GalleryPage />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentPage === 7 && (
            <motion.div
              key="penutup"
              initial={{ opacity: 0, y: 200, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -200, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <PenutupPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CopySuccessToast show={showCopyToast} onClose={() => setShowCopyToast(false)} />
    </div>
  )
}
