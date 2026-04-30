import React, { createContext, useContext, useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageType = 'id' | 'en';

interface Translations {
  [key: string]: {
    [key in LanguageType]: string;
  };
}

export const translations: Translations = {
  // Common
  welcome: { id: 'Selamat Datang', en: 'Welcome' },
  profile: { id: 'Profil Saya', en: 'My Profile' },
  settings: { id: 'Pengaturan', en: 'Settings' },
  language: { id: 'Bahasa', en: 'Language' },
  theme: { id: 'Tema', en: 'Theme' },
  dark_mode: { id: 'Mode Gelap', en: 'Dark Mode' },
  logout: { id: 'Keluar Akun', en: 'Log Out' },
  
  // Chatbot
  ask_something: { id: 'Tanya sesuatu...', en: 'Ask something...' },
  thinking: { id: 'Sedang berpikir...', en: 'Thinking...' },
  history: { id: 'Riwayat Chat', en: 'Chat History' },
  new_chat: { id: 'Chat Baru', en: 'New Chat' },
  delete_chat: { id: 'Hapus Chat', en: 'Delete Chat' },
  select_model: { id: 'Pilih Model AI', en: 'Select AI Model' },
  
  // Profile
  personal_info: { id: 'Informasi Pribadi', en: 'Personal Information' },
  security: { id: 'Keamanan & Privasi', en: 'Security & Privacy' },
  about: { id: 'Tentang EduPartner AI', en: 'About EduPartner AI' },
  save_changes: { id: 'Simpan Perubahan', en: 'Save Changes' },

  // Auth
  login_title_learner: { id: 'Selamat\nDatang 👋', en: 'Welcome\nBack 👋' },
  login_title_tutor: { id: 'Selamat\nDatang Tutor 👋', en: 'Welcome\nTutor 👋' },
  login_subtitle_learner: { id: 'Masuk untuk melanjutkan perjalanan belajarmu dengan AI.', en: 'Log in to continue your learning journey with AI.' },
  login_subtitle_tutor: { id: 'Masuk untuk mulai mengajar dan berbagi ilmu.', en: 'Log in to start teaching and sharing knowledge.' },
  role_learner: { id: 'Pelajar', en: 'Learner' },
  role_tutor: { id: 'Tutor', en: 'Tutor' },
  email_label: { id: 'Alamat Email', en: 'Email Address' },
  email_placeholder: { id: 'Masukkan alamat email', en: 'Enter your email' },
  password_label: { id: 'Kata Sandi', en: 'Password' },
  password_placeholder: { id: 'Masukkan kata sandi', en: 'Enter your password' },
  forgot_password: { id: 'Lupa Kata Sandi?', en: 'Forgot Password?' },
  forgot_password_desc: { id: 'Masukkan email Anda untuk menerima instruksi pengaturan ulang kata sandi.', en: 'Enter your email to receive password reset instructions.' },
  send_reset_link: { id: 'Kirim Tautan Reset', en: 'Send Reset Link' },
  reset_link_sent: { id: 'Tautan reset telah dikirim ke email Anda. Silakan periksa kotak masuk.', en: 'Reset link has been sent to your email. Please check your inbox.' },
  verify_email_btn: { id: 'Cek Email', en: 'Check Email' },
  reset_password_btn: { id: 'Atur Ulang Kata Sandi', en: 'Reset Password' },
  password_reset_success: { id: 'Kata sandi berhasil diubah! Silakan masuk kembali.', en: 'Password reset successful! Please log in again.' },
  back_to_login: { id: 'Kembali ke Login', en: 'Back to Login' },
  login_btn: { id: 'Masuk Sekarang', en: 'Log In Now' },
  login_btn_tutor: { id: 'Masuk Sebagai Tutor', en: 'Log In as Tutor' },
  or_login_with: { id: 'ATAU LOG IN DENGAN', en: 'OR LOG IN WITH' },
  no_account: { id: 'Belum memiliki akun?', en: "Don't have an account?" },
  no_account_tutor: { id: 'Belum memiliki akun Tutor?', en: "Don't have a Tutor account?" },
  register_here: { id: 'Daftar di sini', en: 'Register here' },
  register_as_tutor: { id: 'Daftar sebagai tutor', en: 'Register as tutor' },

  // Tutor
  edit_profile: { id: 'Edit Profil', en: 'Edit Profile' },
  my_subjects: { id: 'Subjek Saya', en: 'My Subjects' },
  availability: { id: 'Ketersediaan', en: 'Availability' },
  tutor_stats_sessions: { id: 'Sesi', en: 'Sessions' },
  tutor_stats_students: { id: 'Siswa', en: 'Students' },
  tutor_stats_rating: { id: 'Rating', en: 'Rating' },

  // Home
  greeting_morning: { id: 'Selamat Pagi', en: 'Good Morning' },
  greeting_afternoon: { id: 'Selamat Siang', en: 'Good Afternoon' },
  greeting_evening: { id: 'Selamat Malam', en: 'Good Evening' },
  ready_to_learn: { id: 'Siap menguasai keahlian baru hari ini?', en: 'Ready to master new skills today?' },
  ai_guide: { id: 'Biarkan AI memandu perjalanan belajarmu.', en: 'Let AI guide your learning journey.' },
  search_placeholder: { id: 'Cari mata kuliah atau tutor...', en: 'Search subjects or tutors...' },
  search_btn: { id: 'Cari', en: 'Search' },
  find_tutor_ai: { id: 'Cari Tutor dengan AI', en: 'Find Tutor with AI' },
  personalize_search: { id: 'Personalisasi pencarianmu sekarang', en: 'Personalize your search now' },
  ai_study_planner: { id: 'AI Rencana Belajar', en: 'AI Study Planner' },
  auto_schedule: { id: 'Buat jadwal belajar otomatis', en: 'Create automatic study schedule' },
  study_groups: { id: 'Grup Belajar', en: 'Study Groups' },
  learn_with_friends: { id: 'Belajar bersama teman lebih menyenangkan', en: 'Learning with friends is more fun' },
  see_all: { id: 'Lihat Semua', en: 'See All' },
  upcoming_sessions: { id: 'Sesi Mendatang', en: 'Upcoming Sessions' },
  total_sessions: { id: 'TOTAL SESI', en: 'TOTAL SESSIONS' },
  no_sessions: { id: 'Tidak ada sesi yang dijadwalkan', en: 'No sessions scheduled' },
  register_to_see_sessions: { id: 'Daftarkan akun untuk melihat sesi.', en: 'Register an account to see sessions.' },

  // Search/Subjects
  search_title: { id: 'Eksplorasi', en: 'Explore' },
  popular_subjects: { id: 'Subjek Populer', en: 'Popular Subjects' },
  all_subjects: { id: 'Semua Subjek', en: 'All Subjects' },
  tutor_count: { id: '{count} Tutor tersedia', en: '{count} Tutors available' },

  // Sessions
  sessions_title: { id: 'Sesi Saya', en: 'My Sessions' },
  sessions_subtitle: { id: 'Kelola semua jadwal belajarmu di satu tempat.', en: 'Manage all your study schedules in one place.' },
  active_sessions: { id: 'Sesi Aktif', en: 'Active Sessions' },
  past_sessions: { id: 'Sesi Lampau', en: 'Past Sessions' },
  waiting_for_info: { id: 'Menunggu Info', en: 'Waiting for Info' },
  no_sessions_found: { id: 'Belum ada sesi yang ditemukan.', en: 'No sessions found.' },
  status_pending: { id: 'Menunggu', en: 'Pending' },
  status_booked: { id: 'Terjadwal', en: 'Booked' },
  status_completed: { id: 'Selesai', en: 'Completed' },
  status_cancelled: { id: 'Dibatalkan', en: 'Cancelled' },
  view_chat: { id: 'Buka Chat', en: 'Open Chat' },

  // Progress
  learning_journey: { id: 'Perjalanan Belajarku', en: 'My Learning Journey' },
  top_student_momentum: { id: 'Kamu berada di 5% pelajar teratas minggu ini. Pertahankan momentumnya!', en: 'You are in the top 5% of students this week. Keep it up!' },
  start_adventure: { id: 'Siap memulai petualangan belajarmu? Selesaikan sesi pertama untuk melihat statistik di sini!', en: 'Ready to start your learning adventure? Complete your first session to see stats here!' },
  collaborative_mode: { id: 'Mode Kolaboratif', en: 'Collaborative Mode' },
  invite_friends: { id: 'Undang teman untuk belajar bersama', en: 'Invite friends to learn together' },
  learning_pulse: { id: 'Denyut Belajar', en: 'Learning Pulse' },
  registered_sessions: { id: 'Sesi Terdaftar', en: 'Registered Sessions' },
  weekly_target: { id: 'Target Mingguan', en: 'Weekly Target' },
  points_collected: { id: 'Poin Edu Terkumpul', en: 'Edu Points Collected' },
  redeem_gift: { id: 'Tukarkan Hadiah', en: 'Redeem Gift' },
  session_status: { id: 'Status Sesi Belajar', en: 'Study Session Status' },
  latest_badges: { id: 'Lencana Terbaru', en: 'Latest Badges' },
  learning_activity: { id: 'Aktivitas Belajar', en: 'Learning Activity' },
  total_completed_week: { id: 'Total sesi selesai minggu ini', en: 'Total sessions completed this week' },
  week: { id: 'Minggu', en: 'Week' },
  month: { id: 'Bulan', en: 'Month' },

  // Tabs
  tab_home: { id: 'Beranda', en: 'Home' },
  tab_search: { id: 'Cari', en: 'Search' },
  tab_sessions: { id: 'Sesi', en: 'Sessions' },
  tab_chat: { id: 'AI Chat', en: 'AI Chat' },
  tab_profile: { id: 'Profil', en: 'Profile' },
  tab_requests: { id: 'Permintaan', en: 'Requests' },
  tab_messages: { id: 'Pesan', en: 'Messages' },
  tutor_greeting: { id: 'Selamat datang kembali,', en: 'Welcome back,' },
  incoming_requests: { id: 'Permintaan Masuk', en: 'Incoming Requests' },
  no_incoming_requests: { id: 'Belum ada permintaan masuk', en: 'No incoming requests yet' },
  student_requests_desc: { id: 'Permintaan dari siswa akan muncul di sini', en: 'Requests from students will appear here' },
  accept_request_success: { id: 'Permintaan sesi berhasil diterima.', en: 'Session request accepted successfully.' },
  reject_request_success: { id: 'Permintaan sesi berhasil ditolak.', en: 'Session request rejected successfully.' },
  process_request_error: { id: 'Gagal memproses permintaan.', en: 'Failed to process request.' },
  loading_dashboard: { id: 'Memuat Dashboard...', en: 'Loading Dashboard...' },
  no_scheduled_sessions: { id: 'Belum ada sesi terjadwal.', en: 'No scheduled sessions yet.' },
  my_sessions: { id: 'Sesi Saya', en: 'My Sessions' },
  total: { id: 'total', en: 'total' },
  confirmed_sessions_desc: { id: 'Sesi yang sudah dikonfirmasi akan muncul di sini.', en: 'Confirmed sessions will appear here.' },
  preferences: { id: 'Preferensi', en: 'Preferences' },
  other: { id: 'Lainnya', en: 'Other' },
  about_edupartner: { id: 'Tentang EduPartner AI', en: 'About EduPartner AI' },
  version: { id: 'Versi', en: 'Version' },
  edit_profile_desc: { id: 'Nama, Foto, Bio & Keahlian', en: 'Name, Photo, Bio & Skills' },
  my_subjects_desc: { id: 'Kelola mata pelajaran yang diajar', en: 'Manage taught subjects' },
  availability_desc: { id: 'Atur jadwal jam mengajar Anda', en: 'Set your teaching hours' },
  settings_desc: { id: 'Notifikasi, Keamanan & Akun', en: 'Notifications, Security & Account' },
  rank: { id: 'Peringkat', en: 'Rank' },
  available_now: { id: 'Tersedia Sekarang', en: 'Available Now' },
  tutor_not_found: { id: 'Tidak Ditemukan', en: 'Not Found' },
  try_another_keyword: { id: 'Coba kata kunci lain untuk menemukan tutor.', en: 'Try another keyword to find tutors.' },
  finish_first_session_badge: { id: 'Selesaikan sesi pertamamu untuk mendapatkan lencana!', en: 'Complete your first session to earn badges!' },
  no_sessions_booked: { id: 'Belum ada sesi yang dipesan.', en: 'No sessions booked yet.' },
  notifications: { id: 'Notifikasi', en: 'Notifications' },
  notif_new_request_title: { id: 'Permintaan Sesi Baru', en: 'New Session Request' },
  notif_new_request_desc: { id: '{name} memesan sesi {subject} pada {date} {time}.', en: '{name} booked a {subject} session on {date} {time}.' },
  notif_booking_sent_title: { id: 'Pesanan Sesi Terkirim', en: 'Session Request Sent' },
  notif_booking_sent_desc: { id: 'Pesanan sesi {subject} kamu pada {date} {time} telah dikirim ke Tutor {name}. Menunggu konfirmasi.', en: 'Your {subject} session request on {date} {time} has been sent to Tutor {name}. Waiting for confirmation.' },
  notif_session_confirmed_title: { id: 'Sesi Dikonfirmasi', en: 'Session Confirmed' },
  notif_session_confirmed_desc: { id: 'Tutor {name} telah menerima pesanan sesi {subject} kamu pada {date} {time}.', en: 'Tutor {name} has accepted your {subject} session request on {date} {time}.' },
  notif_session_rejected_title: { id: 'Sesi Ditolak', en: 'Session Rejected' },
  notif_session_rejected_desc: { id: 'Tutor {name} tidak dapat menerima pesanan sesi {subject} kamu pada {date} {time}.', en: 'Tutor {name} could not accept your {subject} session request on {date} {time}.' },
  just_now: { id: 'Baru saja', en: 'Just now' },
  mins_ago: { id: '{n} mnt lalu', en: '{n} mins ago' },
  hours_ago: { id: '{n} jam lalu', en: '{n} hours ago' },
  days_ago: { id: '{n} hari lalu', en: '{n} days ago' },
  no_new_notifications: { id: 'Tidak ada alert baru saat ini.', en: 'No new alerts at this time.' },
  all_notifications_read: { id: 'Semua notifikasi telah dibaca! 🎉', en: 'All notifications read! 🎉' },
  notifications_subtitle: { id: 'Tetap terupdate dengan perjalanan belajar dan wawasan AI-mu.', en: 'Stay updated with your learning journey and AI insights.' },
  new_alerts: { id: 'ALERT BARU', en: 'NEW ALERTS' },
  mark_all_read: { id: 'Tandai semua telah dibaca', en: 'Mark all as read' },
  previous: { id: 'SEBELUMNYA', en: 'PREVIOUS' },
  silent_mode: { id: 'Mode Senyap', en: 'Silent Mode' },
  silent_mode_desc: { id: 'Bisukan semua notifikasi selama 2 jam ke depan untuk masuk ke Deep Work.', en: 'Mute all notifications for the next 2 hours to enter Deep Work.' },
  silent_mode_active_desc: { id: 'Mode senyap sedang aktif. Semua notifikasi dibisukan selama 2 jam.', en: 'Silent mode is active. All notifications are muted for 2 hours.' },
  silent_mode_active_banner: { id: 'Mode Senyap aktif — notifikasi dibisukan 2 jam', en: 'Silent Mode active — notifications muted for 2 hours' },
  turn_off: { id: 'Matikan', en: 'Turn Off' },
  activate_focus: { id: 'Aktifkan Fokus', en: 'Activate Focus' },
  turn_off_silent_mode: { id: 'Matikan Mode Senyap', en: 'Turn Off Silent Mode' },
  no_new_notif_alert: { id: 'Tidak ada notifikasi baru untuk ditandai.', en: 'No new notifications to mark.' },
  all_marked_read_alert: { id: 'Semua notifikasi ditandai sebagai dibaca.', en: 'All notifications marked as read.' },
  at_notifications_page: { id: 'Kamu sedang berada di halaman notifikasi.', en: 'You are currently on the notifications page.' },
  update_notif_error: { id: 'Gagal memperbarui notifikasi.', en: 'Failed to update notifications.' },
  subject_not_found: { id: 'Mata kuliah tidak ditemukan.', en: 'Subject not found.' },
  available_tutors: { id: 'Tutor Tersedia', en: 'Available Tutors' },
  avg_rating: { id: 'Rating Rata-rata', en: 'Avg Rating' },
  topics_learned: { id: 'Topik yang Dipelajari', en: 'Topics Learned' },
  find_tutor_name: { id: 'Cari Tutor {name}', en: 'Find {name} Tutors' },
  start_self_study: { id: 'Mulai Belajar Mandiri', en: 'Start Self Study' },
  hi_name: { id: 'Hai, {name}', en: 'Hi, {name}' },
  reviews_count: { id: '({count} ulasan)', en: '({count} reviews)' },
  status_available: { id: 'Tersedia', en: 'Available' },
  status_full: { id: 'Penuh', en: 'Full' },
  close: { id: 'Tutup', en: 'Close' },
  loading: { id: 'Memuat...', en: 'Loading...' },
  populer: { id: 'POPULER', en: 'POPULAR' },
  selected_session: { id: 'Sesi yang Dipilih', en: 'Selected Session' },
  processing: { id: 'Memproses...', en: 'Processing...' },
  confirm_booking: { id: 'Konfirmasi Pesanan', en: 'Confirm Booking' },
  booking_title: { id: 'Pesan Sesi', en: 'Book Session' },
  booking_subtitle: { id: 'Pilih waktu terbaik untuk mulai belajar dengan tutor ahli.', en: 'Choose the best time to start learning with expert tutors.' },
  choose_date: { id: 'Pilih Tanggal', en: 'Choose Date' },
  available_slots: { id: 'Slot Tersedia', en: 'Available Slots' },
  recommended_groups: { id: 'Grup Belajar Direkomendasikan', en: 'Recommended Study Groups' },
  booking_success: { id: 'Sesi Berhasil Dipesan!', en: 'Session Booked Successfully!' },
  booking_desc: { id: 'Tutor akan segera mengonfirmasi permintaanmu.', en: 'The tutor will confirm your request shortly.' },
  view_progress: { id: 'Lihat Progres', en: 'View Progress' },
  error_tutor_not_found: { id: 'Informasi tutor tidak ditemukan.', en: 'Tutor information not found.' },
  failed_booking_alert: { id: 'Terjadi kesalahan saat memesan sesi.', en: 'An error occurred while booking the session.' },
  participants: { id: 'Peserta', en: 'Participants' },
  student: { id: 'Pelajar', en: 'Student' },
  register_success: { id: 'Registrasi Berhasil!', en: 'Registration Successful!' },
  register_subtitle_tutor: { id: 'Bergabunglah sebagai tutor untuk membantu orang lain belajar.', en: 'Join as a tutor to help others learn.' },
  register_as_tutor_btn: { id: 'Daftar sebagai Tutor', en: 'Register as Tutor' },
  already_have_account_tutor: { id: 'Sudah memiliki akun Tutor?', en: 'Already have a Tutor account?' },
  berhasil: { id: 'Berhasil', en: 'Success' },
  error: { id: 'Kesalahan', en: 'Error' },
  ai_scanner_title: { id: 'Pemindai AI', en: 'AI Scanner' },
  scan_analyze: { id: 'Pindai & Analisis', en: 'Scan & Analyze' },
  scanner_desc: { id: 'Ambil foto materi belajarmu, biarkan AI merangkum dan menjelaskan konsepnya secara instan.', en: 'Take a photo of your study material, let AI summarize and explain concepts instantly.' },
  open_camera: { id: 'Buka Kamera', en: 'Open Camera' },
  camera_desc: { id: 'Pindai langsung dari buku atau catatanmu.', en: 'Scan directly from your book or notes.' },
  choose_gallery: { id: 'Pilih Galeri', en: 'Choose Gallery' },
  gallery_desc: { id: 'Gunakan foto yang sudah ada di HP-mu.', en: 'Use photos already on your phone.' },
  tips_best_result: { id: 'Tips untuk Hasil Terbaik', en: 'Tips for Best Results' },
  tip_lighting: { id: 'Pastikan cahaya cukup terang.', en: 'Ensure bright lighting.' },
  tip_align: { id: 'Sejajarkan teks dengan bingkai kamera.', en: 'Align text with the camera frame.' },
  tip_shadow: { id: 'Hindari bayangan yang menutupi teks.', en: 'Avoid shadows covering the text.' },
  retake: { id: 'Ulangi', en: 'Retake' },
  notes_instructions: { id: 'Catatan / Instruksi Tambahan', en: 'Additional Notes / Instructions' },
  scanner_placeholder: { id: 'Masukkan teks di sini atau gunakan hasil scan...', en: 'Enter text here or use scan results...' },
  analyze_ai: { id: 'Analisis dengan AI', en: 'Analyze with AI' },
  ai_analyzing: { id: 'AI sedang menganalisis...', en: 'AI is analyzing...' },
  error_permission_required: { id: 'Izin Diperlukan', en: 'Permission Required' },
  error_camera_access: { id: 'Aplikasi membutuhkan akses kamera untuk memindai.', en: 'App needs camera access to scan.' },
  error_empty_text: { id: 'Teks Kosong', en: 'Empty Text' },
  error_no_detected_text: { id: 'Silakan masukkan atau koreksi teks yang terdeteksi sebelum menganalisis.', en: 'Please enter or correct the detected text before analyzing.' },
  failed_analyze_alert: { id: 'AI tidak dapat menganalisis teks saat ini. Coba lagi.', en: 'AI cannot analyze the text at this time. Please try again.' },
  error_analyzing: { id: 'Terjadi kesalahan saat menganalisis.', en: 'An error occurred while analyzing.' },
  error_invalid_password: { id: 'Kata sandi salah.', en: 'Invalid password.' },
  analysis_result: { id: 'Hasil Analisis', en: 'Analysis Result' },
  your_instructions: { id: 'Instruksi / Catatan Anda', en: 'Your Instructions / Notes' },
  ai_explanation: { id: 'Penjelasan AI', en: 'AI Explanation' },
  ask_more: { id: 'Tanya Lebih Lanjut', en: 'Ask More' },
  find_tutor_topic: { id: 'Cari Tutor Topik Ini', en: 'Find Tutor for this Topic' },
  scan_again: { id: 'Pindai Lagi', en: 'Scan Again' },
  explain_more_about: { id: 'Jelaskan lebih lanjut tentang', en: 'Explain more about' },
  study_planner_title: { id: 'Perencana Belajar', en: 'Study Planner' },
  create_schedule: { id: 'Buat Jadwal Belajar', en: 'Create Study Schedule' },
  planner_desc: { id: 'Beri tahu AI apa yang ingin kamu pelajari, dan kami akan buatkan rencana belajar yang dipersonalisasi untukmu.', en: 'Tell AI what you want to learn, and we will create a personalized study plan for you.' },
  subject_label: { id: 'Mata Pelajaran / Topik', en: 'Subject / Topic' },
  subject_placeholder: { id: 'Contoh: React Native Dasar', en: 'Ex: Basic React Native' },
  goal_label: { id: 'Tujuan Belajar', en: 'Learning Goal' },
  goal_placeholder: { id: 'Contoh: Bisa membuat aplikasi sederhana', en: 'Ex: Able to build a simple app' },
  hours_day_label: { id: 'Jam per Hari', en: 'Hours/Day' },
  duration_label: { id: 'Durasi (Hari)', en: 'Duration (Days)' },
  generate_plan: { id: 'Buat Rencana Belajar', en: 'Generate Study Plan' },
  error_invalid_input: { id: 'Input Tidak Valid', en: 'Invalid Input' },
  error_hours_range: { id: 'Jam belajar per hari harus antara 1-12 jam.', en: 'Study hours per day must be between 1-12 hours.' },
  error_days_range: { id: 'Durasi harus antara 1-30 hari.', en: 'Duration must be between 1-30 days.' },
  error_system: { id: 'Terjadi kesalahan sistem.', en: 'A system error occurred.' },
  plan_result: { id: 'Hasil Rencana Belajar', en: 'Study Plan Result' },
  study_plan_for: { id: 'Rencana Belajar: {subject}', en: 'Study Plan: {subject}' },
  plan_overview_default: { id: 'Ikuti rencana terstruktur ini untuk mencapai tujuanmu.', en: 'Follow this structured plan to achieve your goal.' },
  day_label: { id: 'HARI', en: 'DAY' },
  hours_abbr: { id: 'Jam', en: 'Hrs' },
  failed_load_plan: { id: 'Gagal memuat rencana.', en: 'Failed to load plan.' },
  go_back: { id: 'Kembali', en: 'Go Back' },
  customize_learning: { id: 'Sesuaikan Belajar Anda', en: 'Customize Your Learning' },
  ai_find_tutor_desc: { id: 'Biarkan AI kami menemukan tutor yang paling cocok dengan gaya belajar dan waktu pilihanmu.', en: 'Let our AI find the tutor that best matches your learning style and preferred time.' },
  topic_label: { id: 'Topik Spesifik (Opsional)', en: 'Specific Topic (Optional)' },
  topic_placeholder: { id: 'Contoh: Turunan atau Integrasi', en: 'Ex: Derivatives or Integration' },
  learning_style_label: { id: 'Gaya Belajar', en: 'Learning Style' },
  time_pref_label: { id: 'Waktu Pilihan', en: 'Preferred Time' },
  difficulty_label: { id: 'Tingkat Kesulitan', en: 'Difficulty Level' },
  additional_notes: { id: 'Catatan Tambahan', en: 'Additional Notes' },
  notes_placeholder: { id: 'Sebutkan kebutuhan khusus Anda...', en: 'Mention your specific needs...' },
  find_best_tutor: { id: 'Cari Tutor Terbaik', en: 'Find Best Tutor' },
  opt_visual: { id: 'Visual', en: 'Visual' },
  opt_theory: { id: 'Teori', en: 'Theory' },
  opt_practice: { id: 'Praktik', en: 'Practice' },
  opt_morning: { id: 'Pagi', en: 'Morning' },
  opt_afternoon: { id: 'Siang', en: 'Afternoon' },
  opt_evening: { id: 'Malam', en: 'Evening' },
  opt_beginner: { id: 'Pemula', en: 'Beginner' },
  opt_intermediate: { id: 'Menengah', en: 'Intermediate' },
  opt_advanced: { id: 'Lanjutan', en: 'Advanced' },
  error_subject_required: { id: 'Silakan masukkan mata pelajaran yang dicari.', en: 'Please enter the subject you are looking for.' },
  error_login_required: { id: 'Sesi tidak ditemukan. Silakan login kembali.', en: 'Session not found. Please login again.' },
  error_verify_user: { id: 'Gagal memverifikasi user. Silakan coba lagi.', en: 'Failed to verify user. Please try again.' },
  error_save_pref: { id: 'Gagal menyimpan preferensi. Silakan coba lagi.', en: 'Failed to save preferences. Please try again.' },
  ai_analysis_title: { id: 'Hasil Analisis AI', en: 'AI Analysis Result' },
  smart_recommendation: { id: 'Rekomendasi Pintar', en: 'Smart Recommendation' },
  ai_match_desc: { id: 'Kami telah menemukan tutor yang cocok dengan gaya belajar {style} pilihanmu.', en: 'We have found tutors that match your preferred {style} learning style.' },
  ai_analyzing_profiles: { id: 'Gemini AI sedang menganalisis profil tutor...', en: 'Gemini AI is analyzing tutor profiles...' },
  no_tutor_found: { id: 'Tidak ada tutor yang ditemukan.', en: 'No tutors found.' },
  try_again: { id: 'Coba Lagi', en: 'Try Again' },
  top_match: { id: 'COCOK', en: 'MATCH' },
  start_learning: { id: 'Mulai Belajar', en: 'Start Learning' },
  ai_insight_default: { id: 'Tutor ini memiliki rekam jejak yang sangat baik dalam mengajar subjek ini.', en: 'This tutor has an excellent track record teaching this subject.' },
  model_balanced_label: { id: 'Seimbang & Cepat', en: 'Balanced & Fast' },
  model_fast_label: { id: 'Paling Cepat', en: 'Fastest' },
  model_smart_label: { id: 'Paling Cerdas', en: 'Smartest' },
  delete_chat_confirm: { id: 'Apakah Anda yakin ingin menghapus semua riwayat obrolan?', en: 'Are you sure you want to delete all chat history?' },
  cancel: { id: 'Batal', en: 'Cancel' },
  delete: { id: 'Hapus', en: 'Delete' },
  failed_delete: { id: 'Gagal menghapus.', en: 'Failed to delete.' },
  complete_profile_chat: { id: 'Silakan lengkapi profil Anda untuk memulai obrolan.', en: 'Please complete your profile to start chatting.' },
  delete_session_title: { id: 'Hapus Sesi', en: 'Delete Session' },
  delete_session_confirm: { id: 'Hapus riwayat pesan untuk sesi ini?', en: 'Delete message history for this session?' },
  today: { id: 'Hari ini', en: 'Today' },
  yesterday: { id: 'Kemarin', en: 'Yesterday' },
  old_chat_history: { id: 'Melihat riwayat obrolan lama.', en: 'Viewing old chat history.' },
  ask_anything_ai: { id: 'Tanyakan apa saja tentang pelajaranmu, AI kami siap membantu.', en: 'Ask anything about your lessons, our AI is ready to help.' },
  suggestion_math: { id: 'Bantu saya belajar Kalkulus', en: 'Help me learn Calculus' },
  suggestion_newton: { id: 'Apa itu Hukum Newton?', en: 'What is Newton\'s Law?' },
  suggestion_study: { id: 'Tips belajar efektif', en: 'Effective study tips' },
  no_history: { id: 'Belum ada riwayat.', en: 'No history yet.' },
  messages_count: { id: '{count} Pesan', en: '{count} Messages' },
  view_all: { id: 'Lihat Semua', en: 'See All' },
  coming_soon: { id: 'Segera Hadir', en: 'Coming Soon' },
  group_explore_soon: { id: 'Fitur eksplorasi grup akan segera hadir!', en: 'Group exploration feature coming soon!' },
  fullname_label: { id: 'Nama Lengkap', en: 'Full Name' },
  university_label: { id: 'Universitas', en: 'University' },
  major_label: { id: 'Jurusan', en: 'Major' },
  phone_number_label: { id: 'Nomor Telepon', en: 'Phone Number' },
  address_label: { id: 'Alamat', en: 'Address' },
  change_photo: { id: 'Ganti Foto', en: 'Change Photo' },
  save_changes_btn: { id: 'Simpan Perubahan', en: 'Save Changes' },
  error_name_empty: { id: 'Nama tidak boleh kosong.', en: 'Name cannot be empty.' },
  profile_update_error: { id: 'Gagal menyimpan profil.', en: 'Failed to save profile.' },
  two_fa_label: { id: 'Autentikasi 2 Faktor', en: '2-Factor Authentication' },
  biometric_label: { id: 'Login Biometrik', en: 'Biometric Login' },
  extra_security_desc: { id: 'Keamanan ekstra untuk akun Anda', en: 'Extra security for your account' },
  quick_login_desc: { id: 'Masuk cepat dengan sidik jari/wajah', en: 'Quick login with fingerprint/face' },
  logout_confirm_title: { id: 'Keluar', en: 'Logout' },
  logout_confirm_desc: { id: 'Apakah Anda yakin ingin keluar?', en: 'Are you sure you want to logout?' },
  batal: { id: 'Batal', en: 'Cancel' },
  profile_updated_success: { id: 'Profil berhasil diperbarui.', en: 'Profile updated successfully.' },
  save_photo_error: { id: 'Gagal menyimpan foto ke server.', en: 'Failed to save photo to server.' },
  profile_photo_updated: { id: 'Foto profil berhasil diubah!', en: 'Profile photo updated successfully!' },
  local_profile_updated: { id: 'Profil lokal diperbarui (User belum terdaftar di database).', en: 'Local profile updated (User not in database).' },
  failed_update_profile: { id: 'Gagal memperbarui profil.', en: 'Failed to update profile.' },
  account_role_mismatch: { id: 'Akun ini terdaftar sebagai {role}, bukan {target}.', en: 'This account is registered as {role}, not {target}.' },
  user_not_found: { id: 'User tidak ditemukan. Silakan daftar terlebih dahulu.', en: 'User not found. Please register first.' },
  error_name_required: { id: 'Nama tidak boleh kosong.', en: 'Name cannot be empty.' },
  error_password_length: { id: 'Kata sandi harus minimal 6 karakter.', en: 'Password must be at least 6 characters.' },
  error_password_mismatch: { id: 'Konfirmasi kata sandi tidak cocok.', en: 'Password confirmation does not match.' },
  register_failed: { id: 'Registrasi gagal', en: 'Registration failed' },
  register_title: { id: 'Buat Akun', en: 'Create Account' },
  register_subtitle: { id: 'Daftar sekarang untuk mulai belajar dengan bantuan AI personal.', en: 'Register now to start learning with personal AI assistance.' },
  name_label: { id: 'Nama Lengkap', en: 'Full Name' },
  name_placeholder: { id: 'masukkan nama lengkap anda', en: 'enter your full name' },
  confirm_password_label: { id: 'Konfirmasi Kata Sandi', en: 'Confirm Password' },
  confirm_password_placeholder: { id: 'masukkan kembali kata sandi', en: 're-enter your password' },
  register_now: { id: 'Daftar Sekarang', en: 'Register Now' },
  terms_text: { id: 'Dengan mendaftar, Anda menyetujui {terms} dan {privacy} kami.', en: 'By registering, you agree to our {terms} and {privacy}.' },
  terms_link: { id: 'Ketentuan Layanan', en: 'Terms of Service' },
  privacy_link: { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
  already_have_account: { id: 'Sudah punya akun?', en: 'Already have an account?' },
  login_here: { id: 'Masuk di sini', en: 'Login here' },
  ai_best_choice: { id: 'PILIHAN TERBAIK AI', en: 'AI BEST CHOICE' },
  about_us: { id: 'Tentang Kami', en: 'About Us' },
  vision_title: { id: 'Visi Kami', en: 'Our Vision' },
  vision_desc: { id: 'EduPartner AI hadir untuk mendemokrasikan pendidikan berkualitas melalui kekuatan Artificial Intelligence. Kami percaya bahwa setiap pelajar berhak mendapatkan asisten pribadi yang memahami cara belajar mereka yang unik.', en: 'EduPartner AI exists to democratize quality education through the power of Artificial Intelligence. We believe every student deserves a personal assistant who understands their unique learning style.' },
  key_features: { id: 'Fitur Unggulan', en: 'Key Features' },
  ai_scanner_desc: { id: 'Pahami materi sulit hanya dengan memotret soal atau catatan Anda.', en: 'Understand difficult materials just by taking a photo of your problems or notes.' },
  study_planner_desc: { id: 'Jadwal belajar otomatis yang disesuaikan dengan target dan waktu Anda.', en: 'Automatic study schedule tailored to your goals and time.' },
  expert_tutors_title: { id: 'Tutor Ahli', en: 'Expert Tutors' },
  expert_tutors_desc: { id: 'Terhubung dengan pengajar ahli yang direkomendasikan khusus oleh AI.', en: 'Connect with expert tutors specifically recommended by AI.' },
  developed_with: { id: 'Dikembangkan dengan ❤️ untuk pendidikan Indonesia.', en: 'Developed with ❤️ for Indonesian education.' },
  all_rights_reserved: { id: 'Hak Cipta Dilindungi Undang-Undang.', en: 'All Rights Reserved.' },
  activity_chart_desc: { id: 'Grafik aktivitas akan muncul setelah kamu menyelesaikan sesi belajar.', en: 'Activity chart will appear once you complete a study session.' },
  incomplete_data: { id: 'Data Tidak Lengkap', en: 'Incomplete Data' },
  tutor_data_incomplete_desc: { id: 'Maaf, data tutor tidak lengkap. Silakan coba lagi nanti.', en: 'Sorry, tutor data is incomplete. Please try again later.' },
  tutor_not_found_title: { id: 'Tutor Tidak Ditemukan', en: 'Tutor Not Found' },
  tutor_not_found_desc: { id: 'Maaf, profil tutor yang Anda cari tidak dapat ditemukan atau sudah tidak tersedia.', en: 'Sorry, the tutor profile you are looking for could not be found or is no longer available.' },
  top_tutor: { id: 'TERATAS', en: 'TOP' },
  experience_label: { id: 'PENGALAMAN', en: 'EXPERIENCE' },
  rate_label: { id: 'TARIF', en: 'RATE' },
  subjects_taught: { id: 'Mata Kuliah Diajar', en: 'Subjects Taught' },
  no_specific_subjects: { id: 'Tidak ada subjek spesifik.', en: 'No specific subjects.' },
  about_tutor: { id: 'Tentang {name}', en: 'About {name}' },
  availability_label: { id: 'Ketersediaan', en: 'Availability' },
  latest_reviews: { id: 'Ulasan Terbaru', en: 'Latest Reviews' },
  redeem_gift_desc: { id: 'Kumpulkan lebih banyak poin untuk menukarkan dengan voucher belajar!', en: 'Collect more points to redeem for study vouchers!' },
  collaborative_mode_desc: { id: 'Fitur ini memungkinkan kamu belajar bersama teman. Segera hadir!', en: 'This feature allows you to study with friends. Coming soon!' },
  badge_morning_title: { id: 'Bangun Pagi', en: 'Early Bird' },
  badge_morning_desc: { id: '4 sesi sebelum jam 8 Pagi', en: '4 sessions before 8 AM' },
  badge_thinker_title: { id: 'Pemikir Dalam', en: 'Deep Thinker' },
  badge_thinker_desc: { id: 'Sesi fokus 2 jam+', en: '2+ hours focus session' },
  badge_fire_title: { id: 'Penguasa Api', en: 'Fire Master' },
  badge_fire_desc: { id: '7 hari beruntun', en: '7 days streak' },
  badge_mentor_title: { id: 'Mentor', en: 'Mentor' },
  badge_mentor_desc: { id: 'Bantu 10 teman', en: 'Help 10 friends' },

  // AI Preferences
  ai_search_pref: { id: 'Preferensi Pencarian AI', en: 'AI Search Preferences' },

  // AI Options

  // Study Planner

  // AI Scanner

  // AI Results
  subject_detail: { id: 'Detail Mata Kuliah', en: 'Subject Detail' },
  people_count: { id: 'Tersedia {count} orang', en: '{count} available' },
  popular: { id: 'POPULER', en: 'POPULAR' },

  // Auth & Errors
  error_email_required: { id: 'Alamat Email harus diisi', en: 'Email address is required' },
  error_email_invalid: { id: 'Format email tidak valid', en: 'Invalid email format' },
  error_password_required: { id: 'Kata sandi harus diisi', en: 'Password is required' },
  register_success_title: { id: 'Pendaftaran Berhasil!', en: 'Registration Successful!' },

  // AI Chat

  // Subjects
  subject_matematika: { id: 'Matematika', en: 'Mathematics' },
  subject_fisika: { id: 'Fisika', en: 'Physics' },
  subject_kimia: { id: 'Kimia', en: 'Chemistry' },
  subject_biologi: { id: 'Biologi', en: 'Biology' },
  subject_ekonomi: { id: 'Ekonomi', en: 'Economy' },
  subject_sejarah: { id: 'Sejarah', en: 'History' },
  subject_geografi: { id: 'Geografi', en: 'Geography' },
  subject_sosiologi: { id: 'Sosiologi', en: 'Sociology' },
  subject_bahasa_indonesia: { id: 'Bahasa Indonesia', en: 'Indonesian' },
  subject_bahasa_inggris: { id: 'Bahasa Inggris', en: 'English' },
  subject_pemrograman: { id: 'Pemrograman', en: 'Programming' },
  subject_koding: { id: 'Koding', en: 'Coding' },
  subject_bahasa: { id: 'Bahasa', en: 'Language' },
  subject_kalkulus: { id: 'Kalkulus', en: 'Calculus' },
  subject_statistika: { id: 'Statistika', en: 'Statistics' },
  subject_desain_grafis: { id: 'Desain Grafis', en: 'Graphic Design' },
  subject_umum: { id: 'Umum', en: 'General' },
  subject_general: { id: 'Umum', en: 'General' },
  subject_general_study: { id: 'Studi Umum', en: 'General Study' },

  // Topics
  topic_linear_algebra: { id: 'Aljabar Linear', en: 'Linear Algebra' },
  topic_calculus: { id: 'Kalkulus', en: 'Calculus' },
  topic_statistics: { id: 'Statistika', en: 'Statistics' },
  topic_geometry: { id: 'Geometri', en: 'Geometry' },
  topic_differential: { id: 'Persamaan Diferensial', en: 'Differential Equations' },
  topic_python: { id: 'Python', en: 'Python' },
  topic_javascript: { id: 'JavaScript', en: 'JavaScript' },
  topic_data_structures: { id: 'Struktur Data', en: 'Data Structures' },
  topic_mobile_dev: { id: 'Pengembangan Mobile', en: 'Mobile Development' },
  topic_machine_learning: { id: 'Machine Learning', en: 'Machine Learning' },
  topic_academic_english: { id: 'Bahasa Inggris Akademik', en: 'Academic English' },
  topic_toefl: { id: 'Persiapan TOEFL/IELTS', en: 'TOEFL/IELTS Prep' },
  topic_spanish: { id: 'Bahasa Spanyol', en: 'Spanish' },
  topic_mandarin: { id: 'Bahasa Mandarin', en: 'Mandarin' },
  topic_korean: { id: 'Bahasa Korea', en: 'Korean' },
  topic_cell_biology: { id: 'Biologi Sel', en: 'Cell Biology' },
  topic_genetics: { id: 'Genetika', en: 'Genetics' },
  topic_anatomy: { id: 'Anatomi', en: 'Anatomy' },
  topic_ecology: { id: 'Ekologi', en: 'Ecology' },
  topic_biotechnology: { id: 'Bioteknologi', en: 'Biotechnology' },
  topic_ui_ux: { id: 'UI/UX Design', en: 'UI/UX Design' },
  topic_visual_principles: { id: 'Prinsip Visual', en: 'Visual Principles' },
  topic_figma: { id: 'Figma', en: 'Figma' },
  topic_typography: { id: 'Tipografi', en: 'Typography' },
  topic_graphic_design: { id: 'Desain Grafis', en: 'Graphic Design' },
  topic_indo_history: { id: 'Sejarah Indonesia', en: 'Indonesian History' },
  topic_ancient_civ: { id: 'Peradaban Kuno', en: 'Ancient Civilization' },
  topic_modern_europe: { id: 'Eropa Modern', en: 'Modern Europe' },
  topic_world_war: { id: 'Perang Dunia', en: 'World War' },
  topic_contemporary_asia: { id: 'Asia Kontemporer', en: 'Contemporary Asia' },

  // UI
  math_desc: { id: 'Pelajari konsep matematika dari dasar hingga lanjut.', en: 'Learn mathematical concepts from basic to advanced.' },
  coding_desc: { id: 'Kuasai berbagai bahasa pemrograman populer.', en: 'Master various popular programming languages.' },
  language_desc_short: { id: 'Tingkatkan kemampuan bahasa asing Anda.', en: 'Improve your foreign language skills.' },
  biology_desc: { id: 'Eksplorasi dunia kehidupan dan organisme.', en: 'Explore the world of life and organisms.' },
  design_desc: { id: 'Pelajari seni desain visual dan pengalaman pengguna.', en: 'Learn the art of visual design and user experience.' },
  history_desc: { id: 'Pahami peristiwa masa lalu yang membentuk dunia.', en: 'Understand past events that shaped the world.' },

  // Days
  day_sen: { id: 'Sen', en: 'Mon' },
  day_sel: { id: 'Sel', en: 'Tue' },
  day_rab: { id: 'Rab', en: 'Wed' },
  day_kam: { id: 'Kam', en: 'Thu' },
  day_jum: { id: 'Jum', en: 'Fri' },
  day_sab: { id: 'Sab', en: 'Sat' },
  day_min: { id: 'Min', en: 'Sun' },

  // Units
  years: { id: 'tahun', en: 'years' },
  hour: { id: 'jam', en: 'hour' },
};

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('id');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('user_language');
        if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
          setLanguageState(savedLang as LanguageType);
        }
      } catch (e) {
        console.error('Failed to load language', e);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: LanguageType) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('user_language', lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  };

  const t = (key: string, variables?: Record<string, string | number>) => {
    let text = "";

    // Dynamic subject translation helper
    if (key.startsWith('subject_')) {
      const normalizedKey = key.toLowerCase();
      if (translations[normalizedKey]) {
        text = translations[normalizedKey][language] || translations[normalizedKey]['id'];
      } else {
        // Reverse lookup: if the subject was stored in a translated form (e.g. "Studi Umum"),
        // try to find it by matching against existing translation values
        const subjectValue = key.replace('subject_', '').replace(/_/g, ' ');
        let found = false;
        for (const [tKey, tVal] of Object.entries(translations)) {
          if (tKey.startsWith('subject_')) {
            if (tVal.id.toLowerCase() === subjectValue.toLowerCase() || tVal.en.toLowerCase() === subjectValue.toLowerCase()) {
              text = tVal[language] || tVal['id'];
              found = true;
              break;
            }
          }
        }
        if (!found) {
          // Return the cleaned-up subject name as fallback
          text = subjectValue.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      }
    } else {
      if (!translations[key]) {
        text = key;
      } else {
        text = translations[key][language] || translations[key]['id'];
      }
    }

    // Replace variables
    if (variables) {
      Object.entries(variables).forEach(([vKey, vVal]) => {
        text = text.replace(new RegExp(`{${vKey}}`, 'g'), String(vVal));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
