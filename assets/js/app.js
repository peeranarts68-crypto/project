// assets/js/app.js
// Client-side Router, Feeds, Filters, Bookmarks, and Chat Simulator

(() => {
  // Global States
  let currentView = 'view-home';
  let lostFoundTab = 'all';
  let friendTab = 'study';
  let profileTab = 'posts';
  let activeChatId = null;
  let historyStack = ['view-home'];

  const CATEGORY_LABELS = {
    electronics: 'อุปกรณ์อิเล็กทรอนิกส์',
    bags: 'กระเป๋า / สัมภาระ',
    cards: 'บัตร / เอกสาร',
    keys: 'กุญแจ',
    clothes: 'เสื้อผ้า / เครื่องแต่งกาย',
    books: 'หนังสือ / อุปกรณ์การเรียน',
    sports: 'กีฬา / ดนตรี / งานอดิเรก',
    others: 'อื่นๆ'
  };

  const FRIEND_CAT_LABELS = {
    study: 'หาเพื่อนเรียน',
    project: 'หาเพื่อนทำโปรเจกต์',
    activity: 'กิจกรรม',
    sport: 'กีฬา & เกม'
  };

  // Seeding Database on Launch
  const seedDatabase = () => {
    // 1. Seed Mock Users
    if (!localStorage.getItem('psru_users')) {
      localStorage.setItem('psru_users', JSON.stringify([
        { username: 'student@psru.ac.th', password: 'password', name: 'นักศึกษา PSRU', faculty: 'วิทยาการคอมพิวเตอร์', phone: '091-234-5678', line: 'psru.student' }
      ]));
    }

    // 2. Set Default Login Session if none exists
    if (!localStorage.getItem('psru_current_user')) {
      localStorage.setItem('psru_current_user', JSON.stringify({
        username: 'student@psru.ac.th',
        name: 'นักศึกษา PSRU',
        faculty: 'วิทยาการคอมพิวเตอร์',
        email: 'student@psru.ac.th',
        phone: '091-234-5678',
        line: 'psru.student'
      }));
    }

    // 3. Seed Posts
    if (!localStorage.getItem('psru_posts')) {
      const initialPosts = [
        {
          id: 101,
          mainType: 'lost_found',
          type: 'lost',
          title: 'หาย กระเป๋าสตางค์สีดำ',
          category: 'bags',
          description: 'กระเป๋าสตางค์หนังสีดำ ภายในมีบัตรประชาชน ใบขับขี่ และบัตรนักศึกษา ใครพบเจอโปรดติดต่อกลับด่วนครับ มีรางวัลสมนาคุณให้ครับ',
          location: 'อาคารศิลปศาสตร์ ชั้น 1',
          datetime: '2026-05-26T11:20',
          phone: '095-111-2222',
          line: 'wallet.lost',
          author: 'นศ. คณะครุศาสตร์',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
          image: 'https://images.unsplash.com/photo-1627124118317-4f8e8fe58ec8?auto=format&fit=crop&q=80&w=300'
        },
        {
          id: 102,
          mainType: 'lost_found',
          type: 'found',
          title: 'พบ หูฟังไร้สายสีขาว',
          category: 'electronics',
          description: 'พบเคสหูฟังไร้สายสีขาวตกอยู่บริเวณม้านั่ง ใครเป็นเจ้าของนำหลักฐานรูปภาพหรือกล่องหูฟังมาติดต่อขอรับคืนได้เลยนะครับ',
          location: 'โรงอาหารกลาง',
          datetime: '2026-05-26T09:15',
          phone: '089-777-8888',
          line: 'headphone.found',
          author: 'นักศึกษา PSRU',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=300'
        },
        {
          id: 103,
          mainType: 'lost_found',
          type: 'lost',
          title: 'หาย โทรศัพท์ iPhone 13',
          category: 'electronics',
          description: 'ทำโทรศัพท์ iPhone 13 สีน้ำเงิน ใส่เคสใสขอบสีฟ้าหล่นหายแถวๆ ลานจอดรถ มีรูปถ่ายครอบครัวที่สำคัญมากๆ ในเครื่อง ใครพบเจอกรุณาติดต่อกลับด่วนด้วยครับ',
          location: 'ลานจอดรถหน้าอาคารเรียนรวม',
          datetime: '2026-05-25T18:45',
          phone: '081-999-0000',
          line: 'iphone13.lost',
          author: 'นศ. คณะมนุษยศาสตร์',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
          image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300'
        },
        {
          id: 104,
          mainType: 'lost_found',
          type: 'found',
          title: 'พบ บัตรนักศึกษา',
          category: 'cards',
          description: 'เจอบัตรประจำตัวนักศึกษา วางลืมไว้บนโต๊ะคอมแถวหน้าห้องสมุด รหัส 66xxxxxxx นามสกุลศรีสง่า ฝากไว้ที่เคาน์เตอร์เจ้าหน้าที่แล้วนะครับ',
          location: 'ห้องสมุด ชั้น 2',
          datetime: '2026-05-25T14:20',
          phone: '',
          line: 'library.staff',
          author: 'นศ. วิศวกรรมคอมฯ',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
          image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=300'
        },
        {
          id: 105,
          mainType: 'lost_found',
          type: 'lost',
          title: 'หาย กุญแจบ้าน พร้อมพวงกุญแจ',
          category: 'keys',
          description: 'กุญแจบ้าน 2 ดอก แขวนพวงกุญแจยางรูปหมีสีน้ำตาล หล่นหายระหว่างเดินไปตึกกิจกรรม ใครเจอช่วยติดต่อกลับหน่อยครับ เข้าห้องไม่ได้เลย',
          location: 'อาคารกิจกรรมนักศึกษา',
          datetime: '2026-05-24T17:10',
          phone: '084-333-4444',
          line: 'bear.key',
          author: 'นศ. คณะเทคโนโลยีการเกษตร',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
          image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=300'
        },
        // Friend Finder posts
        {
          id: 201,
          mainType: 'friend_finder',
          friendCategory: 'study',
          title: 'หาเพื่อนเรียน วิชา OOP',
          category: 'books',
          description: 'ต้องการหาเพื่อนติว/ทบทวนวิชา Object Oriented Programming (OOP) สำหรับเตรียมสอบกลางภาค สนใจมานั่งคุยแลกเปลี่ยนกันได้ครับ คณะวิทยาการคอมพิวเตอร์',
          location: 'ตึกคอมพิวเตอร์ ชั้น 3',
          datetime: '2026-05-26T10:30',
          phone: '091-234-5678',
          line: 'psru.student',
          author: 'นศ. วิทยาการคอมพิวเตอร์',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
          image: null
        },
        {
          id: 202,
          mainType: 'friend_finder',
          friendCategory: 'project',
          title: 'หาเพื่อนทำโปรเจกต์ Database',
          category: 'books',
          description: 'หาคนร่วมกลุ่มทำโปรเจกต์วิชาฐานข้อมูล พัฒนาเว็บแอปพลิเคชันระบบจัดการร้านค้า ขอกลุ่ม 3 คน ตอนนี้มีแล้ว 2 คน ขาดอีก 1 คนครับ',
          location: 'อาคารคอมพิวเตอร์ ชั้น 3',
          datetime: '2026-05-25T13:00',
          phone: '',
          line: 'db.project',
          author: 'หาเพื่อนทำโปรเจกต์',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100',
          image: null
        },
        {
          id: 203,
          mainType: 'friend_finder',
          friendCategory: 'activity',
          title: 'หาเพื่อนออกกำลังกายวิ่งช่วงเย็น',
          category: 'sports',
          description: 'ชวนเพื่อนๆ พี่ๆ น้องๆ มาวิ่งออกกำลังกายจ๊อกกิ้งช่วงเย็น 17:00 น. เป็นต้นไป วิ่งสบายๆ รอบสนามฟุตบอล มาร่วมสุขภาพดีกันครับ',
          location: 'สนามฟุตบอลมหาวิทยาลัย',
          datetime: '2026-05-24T16:00',
          phone: '083-999-8888',
          line: 'run.psru',
          author: 'นศ. คณะครุศาสตร์',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
          image: null
        },
        {
          id: 204,
          mainType: 'friend_finder',
          friendCategory: 'sport',
          title: 'หาเพื่อนเล่นเกม Valorant',
          category: 'sports',
          description: 'หาเพื่อนตี้ Valorant ค่ำๆ คืนนี้ กดจัดอันดับ (Rank) ขาดตำแหน่งดึงคิว/แทงค์ สนุกสนานไม่เครียด แอดไลน์เข้ามาคุยดึงตี้กันเลยครับ',
          location: 'หอพักหน้ามหาวิทยาลัย',
          datetime: '2026-05-24T20:00',
          phone: '',
          line: 'val.party',
          author: 'หาเพื่อนเล่นเกม',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
          image: null
        },
        {
          id: 205,
          mainType: 'friend_finder',
          friendCategory: 'activity',
          title: 'หาเพื่อนกินข้าวเที่ยงแถวมอ',
          category: 'others',
          description: 'เหงาๆ หาเพื่อนร่วมแชร์ส้มตำปูปลาร้า หรือร้านอาหารตามสั่งหน้ามอช่วงเที่ยง คุยเล่นเรื่องเรียนได้หมดครับ ทักทายกันเข้ามาได้เลย',
          location: 'ร้านป้าส้มตำ หน้าประตู 2',
          datetime: '2026-05-23T11:45',
          phone: '087-654-3210',
          line: 'lunch.buddy',
          author: 'นศ. เทคนิคการสัตวแพทย์',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
          image: null
        }
      ];
      localStorage.setItem('psru_posts', JSON.stringify(initialPosts));
    }

    // 4. Seed Chats Info
    if (!localStorage.getItem('psru_chats')) {
      const initialChats = [
        { id: 'chat_1', postId: 201, peerName: 'นศ. วิทยาการคอมพิวเตอร์', peerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100', unread: 0, lastMsg: 'สนใจประกาศของคุณครับ', time: '10:30' },
        { id: 'chat_2', postId: 102, peerName: 'พบ หูฟังไร้สายสีขาว', peerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', unread: 1, lastMsg: 'ขอบคุณที่ติดต่อครับ', time: '09:45' },
        { id: 'chat_3', postId: 202, peerName: 'หาเพื่อนทำโปรเจกต์', peerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100', unread: 0, lastMsg: 'ยังขาดคนเพิ่มอยู่ไหมครับ', time: 'เมื่อวาน' },
        { id: 'chat_4', postId: 103, peerName: 'หาย iPhone 13', peerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', unread: 0, lastMsg: 'รับของคืนเรียบร้อยแล้ว ขอบคุณครับ', time: '2 วัน' },
        { id: 'chat_5', postId: 204, peerName: 'หาเพื่อนเล่นเกม', peerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', unread: 0, lastMsg: 'โอเคครับ เจอกันวันเสาร์', time: '3 วัน' }
      ];
      localStorage.setItem('psru_chats', JSON.stringify(initialChats));
    }

    // 5. Seed Chat Messages
    if (!localStorage.getItem('psru_messages')) {
      const initialMessages = {
        'chat_1': [
          { sender: 'them', text: 'สวัสดีครับ พอดีสนใจกลุ่มติววิชา OOP ด้วยครับ', time: '10:28' },
          { sender: 'me', text: 'สวัสดีครับ ยินดีเลยครับ ตอนนี้ตั้งกลุ่ม Line ไว้คุยกันแล้วแอดมาร่วมติวได้เลยนะ', time: '10:29' },
          { sender: 'them', text: 'สนใจประกาศของคุณครับ', time: '10:30' }
        ],
        'chat_2': [
          { sender: 'me', text: 'สวัสดีครับ พอดีผมทำหูฟังหล่นหาย น่าจะเป็นชิ้นที่เจอครับ', time: '09:40' },
          { sender: 'them', text: 'สวัสดีครับ สามารถเอาหลักฐานกล่องหรือรูปประวัติการเชื่อมต่อมารับคืนได้นะครับ', time: '09:44' },
          { sender: 'them', text: 'ขอบคุณที่ติดต่อครับ', time: '09:45' }
        ],
        'chat_3': [
          { sender: 'them', text: 'สวัสดีครับ อยากทราบว่ายังขาดคนเพิ่มอยู่ไหมครับ ในส่วนของโปรเจกต์', time: 'เมื่อวาน' }
        ],
        'chat_4': [
          { sender: 'me', text: 'เจอมือถือแล้วใช่ไหมครับ ดีใจด้วยนะครับ', time: '2 วันก่อน' },
          { sender: 'them', text: 'รับของคืนเรียบร้อยแล้ว ขอบคุณครับ', time: '2 วัน' }
        ],
        'chat_5': [
          { sender: 'them', text: 'มาเล่นด้วยกันค่ำนี้ไหมครับ', time: '3 วันก่อน' },
          { sender: 'me', text: 'ได้เลยครับ แอดตี้ดึงห้องไว้เลยนะ', time: '3 วันก่อน' },
          { sender: 'them', text: 'โอเคครับ เจอกันวันเสาร์', time: '3 วัน' }
        ]
      };
      localStorage.setItem('psru_messages', JSON.stringify(initialMessages));
    }

    // 6. Seed Bookmarks array
    if (!localStorage.getItem('psru_bookmarks')) {
      localStorage.setItem('psru_bookmarks', JSON.stringify([101, 201]));
    }
  };

  // Getters & Setters
  const getPosts = () => JSON.parse(localStorage.getItem('psru_posts') || '[]');
  const savePosts = (posts) => localStorage.setItem('psru_posts', JSON.stringify(posts));
  const getBookmarks = () => JSON.parse(localStorage.getItem('psru_bookmarks') || '[]');
  const saveBookmarks = (bookmarks) => localStorage.setItem('psru_bookmarks', JSON.stringify(bookmarks));
  const getChats = () => JSON.parse(localStorage.getItem('psru_chats') || '[]');
  const saveChats = (chats) => localStorage.setItem('psru_chats', JSON.stringify(chats));
  const getMessages = () => JSON.parse(localStorage.getItem('psru_messages') || '{}');
  const saveMessages = (msgs) => localStorage.setItem('psru_messages', JSON.stringify(msgs));

  // SPA Navigator
  window.navigateTo = (viewId, params = null) => {
    const views = document.querySelectorAll('.web-view');
    views.forEach(v => v.classList.remove('active'));

    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
      currentView = viewId;
      
      // Update browser history stack
      if (historyStack[historyStack.length - 1] !== viewId) {
        historyStack.push(viewId);
      }
    }

    // Scroll to Top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update Navigation Links Active States
    const navLinks = document.querySelectorAll('.nav-link-item');
    navLinks.forEach(link => link.classList.remove('active'));

    if (viewId === 'view-home') document.getElementById('nav-link-home')?.classList.add('active');
    else if (viewId === 'view-lostfound') document.getElementById('nav-link-lostfound')?.classList.add('active');
    else if (viewId === 'view-friendfinder') document.getElementById('nav-link-friendfinder')?.classList.add('active');
    else if (viewId === 'view-categories') document.getElementById('nav-link-categories')?.classList.add('active');
    else if (viewId === 'view-chats') document.getElementById('nav-link-chats')?.classList.add('active');
    else if (viewId === 'view-profile') document.getElementById('nav-link-profile')?.classList.add('active');

    // Trigger View Render Loaders
    if (viewId === 'view-home') renderHomeView();
    else if (viewId === 'view-lostfound') {
      if (params && params.type) {
        setLostFoundFilterType(params.type);
      } else {
        renderLostFoundView();
      }
    }
    else if (viewId === 'view-friendfinder') renderFriendFinderView();
    else if (viewId === 'view-categories') renderCategoriesView();
    else if (viewId === 'view-chats') {
      renderChatsView();
      if (params && params.chatId) {
        openChatSession(params.chatId);
      }
    }
    else if (viewId === 'view-profile') renderProfileView();
    else if (viewId === 'view-detail' && params && params.postId) renderPostDetail(params.postId);
  };

  window.goBack = () => {
    if (historyStack.length > 1) {
      historyStack.pop(); // Remove current view
      const prevView = historyStack.pop(); // Pop previous view
      navigateTo(prevView);
    } else {
      navigateTo('view-home');
    }
  };

  // Drawer Toggle
  window.toggleMobileMenu = () => {
    document.getElementById('nav-menu')?.classList.toggle('open');
    document.getElementById('menu-overlay')?.classList.toggle('open');
  };

  // Authentication Status Updates
  const updateAuthNavbar = () => {
    const currentUser = JSON.parse(localStorage.getItem('psru_current_user') || 'null');
    const authNavButtons = document.getElementById('auth-nav-buttons');
    const userProfileSection = document.getElementById('user-profile-section');
    const mobileLoginItem = document.getElementById('mobile-login-item');
    const mobileLogoutItem = document.getElementById('mobile-logout-item');

    if (currentUser) {
      document.querySelectorAll('.auth-only').forEach(el => el.classList.remove('hidden'));

      if (authNavButtons) {
        authNavButtons.innerHTML = `
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Profile" class="user-nav-avatar" onclick="navigateTo('view-profile')" />
          <button class="auth-btn" style="border-color:#E53E3E;color:#E53E3E;" onclick="handleLogout()">ออกจากระบบ</button>
        `;
      }

      if (userProfileSection) {
        userProfileSection.innerHTML = `
          <div class="welcome-text">ยินดีต้อนรับคุณ</div>
          <div class="username-text">${currentUser.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">${currentUser.faculty}</div>
        `;
        userProfileSection.style.display = 'block';
      }

      if (mobileLoginItem) mobileLoginItem.classList.add('hidden');
      if (mobileLogoutItem) mobileLogoutItem.classList.remove('hidden');
    } else {
      document.querySelectorAll('.auth-only').forEach(el => el.classList.add('hidden'));

      if (authNavButtons) {
        authNavButtons.innerHTML = `
          <a href="login.html" class="auth-btn">เข้าสู่ระบบ</a>
        `;
      }

      if (userProfileSection) {
        userProfileSection.style.display = 'none';
      }

      if (mobileLoginItem) mobileLoginItem.classList.remove('hidden');
      if (mobileLogoutItem) mobileLogoutItem.classList.add('hidden');
    }

    // Update unread count indicator badge
    updateUnreadMessageBadge();
  };

  window.handleLogout = () => {
    localStorage.removeItem('psru_current_user');
    updateAuthNavbar();
    alert('ออกจากระบบเรียบร้อยแล้ว');
    navigateTo('view-home');
  };

  const updateUnreadMessageBadge = () => {
    const chats = getChats();
    const totalUnread = chats.reduce((acc, chat) => acc + (chat.unread || 0), 0);
    const badge = document.querySelector('#nav-link-chats .badge-dot');
    if (badge) {
      if (totalUnread > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  };

  // Card element building helper
  const createPostCard = (post, isBookmarked) => {
    const card = document.createElement('div');
    card.className = 'card-item';
    card.onclick = () => navigateTo('view-detail', { postId: post.id });

    // Bookmark Toggle Button
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = `card-bookmark-btn ${isBookmarked ? 'active' : ''}`;
    bookmarkBtn.innerHTML = `<i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>`;
    bookmarkBtn.onclick = (e) => {
      e.stopPropagation();
      toggleBookmark(post.id, bookmarkBtn);
    };

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'card-img-wrapper';

    if (post.image) {
      const img = document.createElement('img');
      img.className = 'card-img';
      img.src = post.image;
      img.alt = post.title;
      imgWrapper.appendChild(img);
    } else {
      const icon = document.createElement('div');
      icon.className = 'card-no-img-icon';
      icon.innerHTML = `<i class="${post.mainType === 'lost_found' ? 'fas fa-box-open' : 'fas fa-user-friends'}"></i>`;
      imgWrapper.appendChild(icon);
    }

    const content = document.createElement('div');
    content.className = 'card-content';

    const header = document.createElement('div');
    header.className = 'card-header-bar';
    
    const tag = document.createElement('span');
    tag.className = `badge-tag badge-${post.type || post.friendCategory}`;
    tag.textContent = post.mainType === 'lost_found' 
      ? (post.type === 'lost' ? 'ของหาย' : 'ของที่พบ') 
      : FRIEND_CAT_LABELS[post.friendCategory] || 'หาเพื่อน';

    const date = document.createElement('span');
    date.className = 'card-date-meta';
    
    // Formatting date
    let formattedDate = '';
    if (post.datetime) {
      const d = new Date(post.datetime);
      formattedDate = `${d.getDate()} พ.ค. 2569 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`;
    }
    date.textContent = formattedDate;

    header.appendChild(tag);
    header.appendChild(date);

    const title = document.createElement('h4');
    title.className = 'card-title-text';
    title.textContent = post.title;

    const desc = document.createElement('p');
    desc.className = 'card-desc-snippet';
    desc.textContent = post.description;

    const footer = document.createElement('div');
    footer.className = 'card-footer-meta';

    const author = document.createElement('div');
    author.className = 'card-author';
    author.innerHTML = `
      <img src="${post.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=30'}" alt="Avatar" class="card-author-avatar" />
      <span>${post.author || 'นักศึกษา'}</span>
    `;

    const location = document.createElement('div');
    location.className = 'card-location';
    location.innerHTML = `<i class="fas fa-map-marker-alt" style="color:var(--primary-color)"></i> ${post.location.split(' ')[0]}`;

    footer.appendChild(author);
    footer.appendChild(location);

    content.appendChild(header);
    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(footer);

    card.appendChild(bookmarkBtn);
    card.appendChild(imgWrapper);
    card.appendChild(content);

    return card;
  };

  const toggleBookmark = (postId, buttonEl) => {
    let bookmarks = getBookmarks();
    const index = bookmarks.indexOf(postId);
    let active = false;

    if (index === -1) {
      bookmarks.push(postId);
      active = true;
      buttonEl.classList.add('active');
      buttonEl.innerHTML = '<i class="fas fa-bookmark"></i>';
    } else {
      bookmarks.splice(index, 1);
      buttonEl.classList.remove('active');
      buttonEl.innerHTML = '<i class="far fa-bookmark"></i>';
    }
    saveBookmarks(bookmarks);

    // Refresh view states
    if (currentView === 'view-profile') renderProfileView();
  };

  // RENDERING VIEW 1: HOME VIEW
  const renderHomeView = () => {
    const grid = document.getElementById('home-posts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const posts = getPosts();
    const bookmarks = getBookmarks();
    
    // Slice latest 6 posts
    const recent = posts.slice(-6).reverse();
    if (recent.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">ยังไม่มีประกาศในระบบขณะนี้</div>';
      return;
    }

    recent.forEach(post => {
      const isBookmarked = bookmarks.includes(post.id);
      grid.appendChild(createPostCard(post, isBookmarked));
    });
  };

  // Search filter triggered from home header
  window.handleMainSearch = () => {
    const query = document.getElementById('mainSearchInput').value.trim();
    if (query === '') return;
    
    // Navigate to lostfound and auto filter
    navigateTo('view-lostfound');
    const lfSearch = document.getElementById('lostfoundSearch');
    if (lfSearch) {
      lfSearch.value = query;
      filterLostFound();
    }
  };

  // RENDERING VIEW 2: LOST & FOUND
  window.setLostFoundFilterType = (type) => {
    lostFoundTab = type;
    const tabs = ['all', 'lost', 'found'];
    tabs.forEach(t => {
      const btn = document.getElementById(`lf-tab-${t}`);
      if (btn) btn.classList.toggle('active', t === type);
    });
    renderLostFoundView();
  };

  window.toggleLostFoundFilters = () => {
    alert('ตัวกรองขั้นสูง คณะ และเวลา กำลังอยู่ในระหว่างพัฒนาโปรโตไทป์');
  };

  window.filterLostFound = () => {
    renderLostFoundView();
  };

  const renderLostFoundView = () => {
    const grid = document.getElementById('lostfound-posts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const query = document.getElementById('lostfoundSearch')?.value.toLowerCase().trim() || '';
    const posts = getPosts().filter(p => p.mainType === 'lost_found');
    const bookmarks = getBookmarks();

    let filtered = posts;

    // Filter by Lost / Found tab
    if (lostFoundTab !== 'all') {
      filtered = filtered.filter(p => p.type === lostFoundTab);
    }

    // Filter by Search Query
    if (query) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) || 
        p.location.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--text-muted)">ไม่พบรายการประกาศที่ค้นหา</div>';
      return;
    }

    filtered.reverse().forEach(post => {
      const isBookmarked = bookmarks.includes(post.id);
      grid.appendChild(createPostCard(post, isBookmarked));
    });
  };

  // RENDERING VIEW 3: FRIEND FINDER
  window.setFriendFilterCategory = (cat) => {
    friendTab = cat;
    const cats = ['study', 'project', 'activity', 'sport'];
    cats.forEach(c => {
      const btn = document.getElementById(`friend-tab-${c}`);
      if (btn) btn.classList.toggle('active', c === cat);
    });
    renderFriendFinderView();
  };

  window.filterFriendFinder = () => {
    renderFriendFinderView();
  };

  const renderFriendFinderView = () => {
    const grid = document.getElementById('friend-posts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const query = document.getElementById('friendSearch')?.value.toLowerCase().trim() || '';
    const posts = getPosts().filter(p => p.mainType === 'friend_finder');
    const bookmarks = getBookmarks();

    // Filter by Active Category Tab
    let filtered = posts.filter(p => p.friendCategory === friendTab);

    // Filter by Search Query
    if (query) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--text-muted)">ยังไม่มีประกาศในหมวดหมู่นี้</div>';
      return;
    }

    filtered.reverse().forEach(post => {
      const isBookmarked = bookmarks.includes(post.id);
      grid.appendChild(createPostCard(post, isBookmarked));
    });
  };

  // RENDERING VIEW 4: CATEGORIES VIEW
  const renderCategoriesView = () => {
    const container = document.getElementById('categories-grid-container');
    if (!container) return;
    container.innerHTML = '';

    const posts = getPosts();
    const categoriesData = [
      { id: 'electronics', label: 'อุปกรณ์อิเล็กทรอนิกส์', icon: 'fas fa-laptop' },
      { id: 'bags', label: 'กระเป๋า / สัมภาระ', icon: 'fas fa-briefcase' },
      { id: 'cards', label: 'บัตร / เอกสาร', icon: 'fas fa-id-card' },
      { id: 'keys', label: 'กุญแจ', icon: 'fas fa-key' },
      { id: 'clothes', label: 'เสื้อผ้า / เครื่องแต่งกาย', icon: 'fas fa-tshirt' },
      { id: 'books', label: 'หนังสือ / อุปกรณ์การเรียน', icon: 'fas fa-book' },
      { id: 'sports', label: 'กีฬา / ดนตรี / งานอดิเรก', icon: 'fas fa-guitar' },
      { id: 'others', label: 'อื่นๆ', icon: 'fas fa-box' }
    ];

    categoriesData.forEach(cat => {
      const count = posts.filter(p => p.category === cat.id).length;
      
      const card = document.createElement('div');
      card.className = 'cat-item-card';
      card.onclick = () => {
        navigateTo('view-lostfound');
        lostFoundTab = 'all';
        const lfSearch = document.getElementById('lostfoundSearch');
        if (lfSearch) {
          lfSearch.value = CATEGORY_LABELS[cat.id];
          filterLostFound();
        }
      };

      card.innerHTML = `
        <div class="cat-item-icon-wrapper">
          <i class="${cat.icon}"></i>
        </div>
        <div class="cat-item-title">${cat.label}</div>
        <div class="cat-item-count">${count} ประกาศ</div>
      `;

      container.appendChild(card);
    });
  };

  // RENDERING VIEW 5: CHATS PANEL & SIMULATOR
  const renderChatsView = () => {
    const container = document.getElementById('chat-list-container');
    if (!container) return;
    container.innerHTML = '';

    const chats = getChats();
    if (chats.length === 0) {
      container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted);">ไม่มีข้อความของคุณในขณะนี้</div>';
      return;
    }

    chats.forEach(chat => {
      const item = document.createElement('div');
      item.className = `chat-item ${activeChatId === chat.id ? 'active' : ''}`;
      item.onclick = () => openChatSession(chat.id);

      item.innerHTML = `
        <img src="${chat.peerAvatar}" alt="Avatar" class="chat-item-avatar" />
        <div class="chat-item-content">
          <div class="chat-item-meta">
            <span class="chat-item-name">${chat.peerName}</span>
            <span class="chat-item-time">${chat.time}</span>
          </div>
          <div class="chat-item-body">
            <span class="chat-item-preview">${chat.lastMsg}</span>
            ${chat.unread > 0 ? `<span class="chat-unread-badge">${chat.unread}</span>` : ''}
          </div>
        </div>
      `;

      container.appendChild(item);
    });
  };

  const openChatSession = (chatId) => {
    activeChatId = chatId;
    
    // Add layout open class for mobile toggle
    document.querySelector('.chats-layout')?.classList.add('chat-open');

    // Update unread count to 0
    let chats = getChats();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].unread = 0;
      saveChats(chats);
    }

    // Refresh chats list sidebar & badges
    renderChatsView();
    updateUnreadMessageBadge();

    // Toggle panes
    document.getElementById('chat-placeholder')?.classList.add('hidden');
    const content = document.getElementById('chat-active-content');
    if (content) content.classList.remove('hidden');

    const activeChat = chats.find(c => c.id === chatId);
    if (!activeChat) return;

    // Load header details
    document.getElementById('active-chat-avatar').src = activeChat.peerAvatar;
    document.getElementById('active-chat-name').textContent = activeChat.peerName;
    
    // Set post details link handler
    const viewPostBtn = document.getElementById('view-linked-post-btn');
    if (viewPostBtn) {
      viewPostBtn.onclick = () => navigateTo('view-detail', { postId: activeChat.postId });
    }

    // Render messages conversation log
    renderChatMessages();
  };

  const renderChatMessages = () => {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    container.innerHTML = '';

    const messages = getMessages()[activeChatId] || [];
    messages.forEach(msg => {
      const wrap = document.createElement('div');
      wrap.className = `msg-wrapper ${msg.sender === 'me' ? 'sent' : 'received'}`;
      wrap.innerHTML = `
        <div class="msg-bubble">${msg.text}</div>
        <div class="msg-time">${msg.time}</div>
      `;
      container.appendChild(wrap);
    });

    // Auto Scroll to bottom
    container.scrollTop = container.scrollHeight;
  };

  window.handleSendChat = (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-message-input');
    const text = input.value.trim();
    if (!text || !activeChatId) return;

    // 1. Save and Render user sent message
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const msgs = getMessages();
    if (!msgs[activeChatId]) msgs[activeChatId] = [];
    msgs[activeChatId].push({ sender: 'me', text: text, time: timeStr });
    saveMessages(msgs);

    // Update last message in chat info
    let chats = getChats();
    const chatIdx = chats.findIndex(c => c.id === activeChatId);
    if (chatIdx !== -1) {
      chats[chatIdx].lastMsg = text;
      chats[chatIdx].time = timeStr;
      saveChats(chats);
    }

    input.value = '';
    renderChatMessages();
    renderChatsView();

    // 2. Chat Simulator Bot Auto Reply after delay
    setTimeout(() => {
      const activeChat = getChats().find(c => c.id === activeChatId);
      if (!activeChat) return;

      const botReplies = [
        'ยินดีครับ สะดวกมารับหรือดูของได้แถวตึกคอม ชั้น 3 นะครับ',
        'ขอบคุณครับ รบกวนแอดไลน์มาคุยเพื่อแชร์พิกัดสถานที่ได้เลยนะ',
        'สะดวกช่วงบ่ายสามโมงเป็นต้นไปครับ เจอกันที่โรงอาหารกลางครับ',
        'ได้ครับผม ตกลงตามที่คุยไว้ ขอบคุณมากๆ ครับ',
        'ยังอยู่ครับ ทักไลน์มาดึงเข้าตี้ได้เลยนะ'
      ];
      const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
      
      const msgsUpdated = getMessages();
      msgsUpdated[activeChatId].push({ sender: 'them', text: randomReply, time: timeStr });
      saveMessages(msgsUpdated);

      let chatsUpdated = getChats();
      const idx = chatsUpdated.findIndex(c => c.id === activeChatId);
      if (idx !== -1) {
        chatsUpdated[idx].lastMsg = randomReply;
        chatsUpdated[idx].time = timeStr;
        saveChats(chatsUpdated);
      }

      // Check if we are still viewing the same chat thread before updating view logs
      if (activeChatId === activeChat.id) {
        renderChatMessages();
      }
      renderChatsView();
    }, 1500);
  };

  // RENDERING VIEW 6: USER PROFILE PORTAL
  window.setProfileViewTab = (tab) => {
    profileTab = tab;
    document.getElementById('profile-menu-posts').classList.toggle('active', tab === 'posts');
    document.getElementById('profile-menu-bookmarks').classList.toggle('active', tab === 'bookmarks');
    renderProfileView();
  };

  const renderProfileView = () => {
    const grid = document.getElementById('profile-posts-grid');
    const title = document.getElementById('profile-tab-title');
    if (!grid) return;
    grid.innerHTML = '';

    const posts = getPosts();
    const bookmarks = getBookmarks();
    const currentUser = JSON.parse(localStorage.getItem('psru_current_user') || '{}');

    // Update Profile User UI fields
    document.getElementById('profile-display-name').textContent = currentUser.name || 'นักศึกษา PSRU';
    document.getElementById('profile-display-email').textContent = currentUser.email || 'student@psru.ac.th';
    document.getElementById('profile-display-faculty').innerHTML = `<i class="fas fa-graduation-cap"></i> ${currentUser.faculty || 'วิทยาการคอมพิวเตอร์'}`;

    // Get count statistics
    const myPosts = posts.filter(p => p.line === currentUser.line);
    document.getElementById('profile-count-posts').textContent = myPosts.length;
    document.getElementById('profile-count-bookmarks').textContent = bookmarks.length;

    let filtered = [];
    if (profileTab === 'posts') {
      title.textContent = 'ประกาศของฉัน';
      filtered = myPosts;
    } else {
      title.textContent = 'บันทึกประกาศไว้';
      filtered = posts.filter(p => bookmarks.includes(p.id));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">ไม่มีรายการ${profileTab === 'posts' ? 'ประกาศ' : 'ที่บันทึก'}ในขณะนี้</div>`;
      return;
    }

    filtered.reverse().forEach(post => {
      const isBookmarked = bookmarks.includes(post.id);
      grid.appendChild(createPostCard(post, isBookmarked));
    });
  };

  // RENDERING VIEW 7: POST DETAIL PREVIEW
  const renderPostDetail = (postId) => {
    const post = getPosts().find(p => p.id === parseInt(postId));
    if (!post) {
      alert('ไม่พบข้อมูลประกาศดังกล่าว');
      goBack();
      return;
    }

    // Set Header
    const typeBadge = document.getElementById('detail-post-type-badge');
    if (typeBadge) {
      typeBadge.textContent = post.mainType === 'lost_found'
        ? (post.type === 'lost' ? 'ของหาย' : 'ของที่พบ')
        : FRIEND_CAT_LABELS[post.friendCategory] || 'หาเพื่อน';
      typeBadge.className = `badge-post-type badge-${post.type || post.friendCategory}`;
    }

    document.getElementById('detail-post-title').textContent = post.title;
    document.getElementById('detail-post-author').textContent = post.author || 'นักศึกษา';
    
    // Formatting date
    let formattedDate = '-';
    if (post.datetime) {
      const d = new Date(post.datetime);
      formattedDate = `${d.getDate()} พ.ค. 2569 เวลา ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`;
    }
    document.getElementById('detail-post-date').textContent = formattedDate;

    // Main Image
    const imgContainer = document.getElementById('detail-main-img-container');
    if (imgContainer) {
      if (post.image) {
        imgContainer.innerHTML = `<img src="${post.image}" alt="${post.title}" class="detail-main-img" />`;
      } else {
        imgContainer.innerHTML = `
          <div class="detail-no-img-placeholder">
            <i class="${post.mainType === 'lost_found' ? 'fas fa-box-open' : 'fas fa-user-friends'}"></i>
            <span>ไม่มีรูปภาพประกอบประกาศ</span>
          </div>
        `;
      }
    }

    // Info Table
    document.getElementById('detail-attr-category').textContent = post.mainType === 'lost_found' 
      ? CATEGORY_LABELS[post.category] || 'อื่นๆ'
      : FRIEND_CAT_LABELS[post.friendCategory] || 'หาเพื่อน';
    document.getElementById('detail-attr-location').textContent = post.location;
    document.getElementById('detail-attr-faculty').textContent = post.faculty || 'วิทยาการคอมพิวเตอร์';
    document.getElementById('detail-attr-datetime').textContent = formattedDate;

    // Description
    document.getElementById('detail-post-desc').textContent = post.description;

    // Contact Channel elements
    const lineEl = document.getElementById('detail-contact-line');
    const phoneEl = document.getElementById('detail-contact-phone');
    
    if (post.line) {
      lineEl.classList.remove('hidden');
      lineEl.querySelector('.val').textContent = post.line;
    } else {
      lineEl.classList.add('hidden');
    }

    if (post.phone) {
      phoneEl.classList.remove('hidden');
      phoneEl.querySelector('.val').textContent = post.phone;
    } else {
      phoneEl.classList.add('hidden');
    }

    // Action Control Button setup
    const chatBtn = document.getElementById('detail-action-chat-btn');
    if (chatBtn) {
      chatBtn.onclick = () => handleStartChatWithPeer(post);
    }

    const bookmarkBtn = document.getElementById('detail-action-bookmark-btn');
    if (bookmarkBtn) {
      const bookmarks = getBookmarks();
      const isBookmarked = bookmarks.includes(post.id);
      bookmarkBtn.className = isBookmarked ? 'btn-bookmark-now active' : 'btn-bookmark-now';
      bookmarkBtn.innerHTML = isBookmarked ? '<i class="fas fa-bookmark"></i> บันทึกแล้ว' : '<i class="far fa-bookmark"></i> บันทึกไว้';
      bookmarkBtn.onclick = () => {
        toggleBookmark(post.id, bookmarkBtn);
        // Refresh active classes inside details panel
        const bms = getBookmarks();
        const active = bms.includes(post.id);
        bookmarkBtn.className = active ? 'btn-bookmark-now active' : 'btn-bookmark-now';
        bookmarkBtn.innerHTML = active ? '<i class="fas fa-bookmark"></i> บันทึกแล้ว' : '<i class="far fa-bookmark"></i> บันทึกไว้';
      };
    }
  };

  const handleStartChatWithPeer = (post) => {
    const currentUser = JSON.parse(localStorage.getItem('psru_current_user') || 'null');
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการติดต่อพูดคุยแชท');
      window.location.href = 'login.html';
      return;
    }

    // If chat is with oneself, block
    if (post.line === currentUser.line) {
      alert('คุณไม่สามารถส่งข้อความหาตัวคุณเองได้');
      return;
    }

    let chats = getChats();
    // Search if chat already exists
    let existingChat = chats.find(c => c.postId === post.id);
    
    if (!existingChat) {
      const newChatId = `chat_${Date.now()}`;
      existingChat = {
        id: newChatId,
        postId: post.id,
        peerName: post.author,
        peerAvatar: post.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
        unread: 0,
        lastMsg: 'เริ่มแชทถามรายละเอียด...',
        time: 'เพิ่งเริ่ม'
      };
      chats.push(existingChat);
      saveChats(chats);

      // Seed first messages
      const msgs = getMessages();
      msgs[newChatId] = [
        { sender: 'them', text: `สวัสดีครับ ยินดีต้อนรับเรื่องประกาศ "${post.title}" สอบถามข้อมูลทางนี้ได้เลยครับ`, time: 'เพิ่งเริ่ม' }
      ];
      saveMessages(msgs);
    }

    // Navigate to Chat Screen
    navigateTo('view-chats', { chatId: existingChat.id });
  };

  // UNIFIED CREATE POST MODAL LOGIC
  window.openCreatePostModal = () => {
    const currentUser = JSON.parse(localStorage.getItem('psru_current_user') || 'null');
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนลงประกาศของหายหรือหาเพื่อน');
      window.location.href = 'login.html';
      return;
    }
    
    document.getElementById('postModal')?.classList.remove('hidden');
    document.getElementById('postModal')?.setAttribute('aria-hidden', 'false');
  };

  window.closeCreatePostModal = () => {
    document.getElementById('postModal')?.classList.add('hidden');
    document.getElementById('postModal')?.setAttribute('aria-hidden', 'true');
    document.getElementById('postForm')?.reset();
    clearSelectedImage();
    togglePostFormFields('lost_found');
  };

  window.handleModalBgClick = (e) => {
    if (e.target.id === 'postModal') closeCreatePostModal();
  };

  window.togglePostFormFields = (mainType) => {
    const groupLfType = document.getElementById('group-lf-type');
    const groupFriendCat = document.getElementById('group-friend-category');
    const groupLfItemCat = document.getElementById('group-lf-item-category');
    const groupLfDatetime = document.getElementById('group-lf-datetime');
    const lblTitle = document.getElementById('lbl-title');

    if (mainType === 'lost_found') {
      groupLfType?.classList.remove('hidden');
      groupLfItemCat?.classList.remove('hidden');
      groupLfDatetime?.classList.remove('hidden');
      groupFriendCat?.classList.add('hidden');
      if (lblTitle) lblTitle.textContent = 'ชื่อสิ่งของ / หัวข้อประกาศ *';
    } else {
      groupLfType?.classList.add('hidden');
      groupLfItemCat?.classList.add('hidden');
      groupLfDatetime?.classList.add('hidden');
      groupFriendCat?.classList.remove('hidden');
      if (lblTitle) lblTitle.textContent = 'หัวข้อตามหาเพื่อน / กลุ่มกิจกรรม *';
    }
  };

  // Image Upload File Preview Handler
  let selectedImageBase64 = null;

  window.handleImageFileSelect = (input) => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImageBase64 = e.target.result;
      const previewBar = document.getElementById('modal-img-preview-bar');
      const previewImg = document.getElementById('modal-img-preview');
      if (previewBar && previewImg) {
        previewImg.src = selectedImageBase64;
        previewBar.classList.remove('hidden');
      }
    };
    reader.readAsDataURL(file);
  };

  window.clearSelectedImage = () => {
    selectedImageBase64 = null;
    const fileInput = document.getElementById('postImage');
    if (fileInput) fileInput.value = '';
    document.getElementById('modal-img-preview-bar')?.classList.add('hidden');
  };

  window.handleCreatePostSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById('postForm');
    const formData = new FormData(form);
    const currentUser = JSON.parse(localStorage.getItem('psru_current_user') || '{}');

    const mainType = formData.get('post_main_type');
    const newPostId = Date.now() + Math.floor(Math.random() * 100);

    const newPost = {
      id: newPostId,
      mainType: mainType,
      title: formData.get('title').trim(),
      description: formData.get('description').trim(),
      location: formData.get('location').trim(),
      phone: formData.get('phone').trim() || currentUser.phone || '',
      line: formData.get('line').trim() || currentUser.line || '',
      author: currentUser.name || 'นักศึกษา',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
      image: selectedImageBase64,
      faculty: currentUser.faculty || 'วิทยาการคอมพิวเตอร์'
    };

    if (mainType === 'lost_found') {
      newPost.type = formData.get('type');
      newPost.category = formData.get('itemCategory');
      newPost.datetime = formData.get('datetime') || new Date().toISOString().substring(0, 16);
    } else {
      newPost.friendCategory = formData.get('friendCategory');
      newPost.category = 'others';
      newPost.datetime = new Date().toISOString().substring(0, 16);
    }

    let posts = getPosts();
    posts.push(newPost);
    savePosts(posts);

    alert('ลงประกาศเสร็จเรียบร้อยแล้ว!');
    closeCreatePostModal();

    // Route to feeds
    if (mainType === 'lost_found') {
      navigateTo('view-lostfound');
    } else {
      navigateTo('view-friendfinder');
    }
  };

  // APP INITIALIZATION
  document.addEventListener('DOMContentLoaded', () => {
    seedDatabase();
    updateAuthNavbar();
    
    // Hash Routing Fallback (for login.html redirect compatibility)
    const hash = window.location.hash;
    if (hash === '#login') {
      window.location.href = 'login.html';
    } else if (hash === '#register') {
      window.location.href = 'register.html';
    } else {
      // Default Load Home view
      navigateTo('view-home');
    }
  });

})();
