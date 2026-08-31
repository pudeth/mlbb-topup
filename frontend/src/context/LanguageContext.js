import React, { createContext, useContext, useState } from 'react';

export const translations = {
  en: {
    // Top Bar
    instant_delivery_banner: "⚡ Instant Delivery Active: KHQR Bakong automated top-up within 10 seconds!",
    
    // Navbar
    nav_home: "Home",
    nav_topup: "Top Up Diamonds",
    nav_support: "Help & FAQ",
    nav_privacy: "Privacy & Terms",
    nav_terms: "Terms & Conditions",
    nav_admin: "Admin",
    nav_instant_btn: "Instant Top Up",
    nav_guest: "Guest Checkout",
    
    // Hero
    hero_badge: "Cambodia's #1 Instant MLBB Diamond Store",
    hero_title_1: "Top-Up",
    hero_title_highlight: "MLBB Diamonds",
    hero_title_2: "In Seconds",
    hero_desc: "Enjoy zero-fee checkout via Bakong KHQR. No registration required, 100% official reseller, and automated instant delivery direct to your mailbox.",
    hero_btn_topup: "Start Top Up Now",
    hero_btn_support: "How It Works & Support",
    hero_stat_delivery: "Avg Delivery",
    hero_stat_orders: "Orders Done",
    hero_stat_trust: "Trust Score",
    
    // Hero Card
    card_game_title: "Mobile Legends Top-Up",
    card_api_ready: "Instant API Ready",
    card_feat_1_title: "No Login Required (Guest Mode)",
    card_feat_1_desc: "Direct top-up using Player ID only",
    card_feat_2_title: "KHQR Bakong Integration",
    card_feat_2_desc: "Pay with ABA, Wing, ACLEDA, Canadia",
    card_feat_3_title: "Official Player ID Check",
    card_feat_3_desc: "Live in-game nickname verification",
    card_goto_topup: "Go to Top Up",
    
    // Home Sections
    sec_games_badge: "Official Game Store",
    sec_games_title: "Select Your Game",
    sec_games_desc: "Choose your favorite game below for instant automated top-up with zero fees.",
    sec_games_search_placeholder: "Search games (e.g. Mobile Legends, Free Fire...)",
    sec_games_filter_all: "All Games",
    sec_games_filter_moba: "MOBA",
    sec_games_filter_br: "Battle Royale",
    sec_games_filter_rpg: "RPG & Action",
    sec_games_btn_topup: "Top Up Now",
    sec_games_instant_tag: "Instant 10s",
    sec_popular_badge: "Best Deals",
    sec_popular_title: "Featured Games",
    sec_view_all: "View All Games",
    sec_buy_btn: "Top Up",
    
    // 4 Steps Guide
    steps_badge: "Simple 4 Steps",
    steps_title: "How To Top Up Diamonds",
    steps_desc: "Recharge your MLBB diamonds in less than a minute with zero hassle.",
    step1_title: "Enter Player ID",
    step1_desc: "Provide your MLBB User ID & Zone ID. Our system automatically checks your gamer tag.",
    step2_title: "Choose Diamonds",
    step2_desc: "Select from our wide range of diamond packs, weekly diamond passes, and bulk deals.",
    step3_title: "Scan Bakong KHQR",
    step3_desc: "Scan the dynamic KHQR code with ABA Mobile, Wing, ACLEDA, or any banking app.",
    step4_title: "Instant Delivery",
    step4_desc: "Diamonds appear directly in your MLBB in-game mailbox within 10 seconds!",
    
    // FAQ
    faq_badge: "Got Questions?",
    faq_title: "Frequently Asked Questions",
    
    // Bottom CTA
    cta_title: "Ready to Dominate the Battlefield?",
    cta_desc: "Get your Mobile Legends diamonds right now and unlock your favorite heroes, skins, and passes instantly.",
    cta_btn: "Top Up Diamonds Now",
    
    // TopUp Page
    topup_header_title: "Mobile Legends: Bang Bang",
    topup_header_desc: "Direct diamond top-up with official server verification & Bakong KHQR instant checkout.",
    topup_official: "Official",
    topup_instant: "10s Instant",
    topup_online: "Online",
    
    // Step 1
    step_1_heading: "Enter User ID & Zone ID",
    where_is_id: "Where is my ID?",
    id_guide_title: "How to find your Mobile Legends IDs:",
    id_guide_1: "1. Open MLBB and tap your Avatar in the top-left.",
    id_guide_2: "2. Locate: User ID: 1225368571 (11446).",
    id_guide_3: "3. First number is Player ID, bracketed is Zone ID.",
    id_guide_tip: "💡 You can paste \"1225368571 (11446)\" into the Player ID field directly!",
    player_id_label: "Player ID",
    server_id_label: "Zone / Server ID",
    auto_detected: "Auto-detected",
    paste_hint: "Paste whole ID string to auto-split",
    inside_brackets: "Inside the brackets ( )",
    check_btn: "Check",
    verified_badge: "Verified",
    server_label: "Server",
    
    // Step 2
    step_2_heading: "Select Diamond Amount",
    cat_all: "All",
    cat_popular: "Popular",
    cat_bulk: "Bulk",
    cat_custom: "✍️ Custom",
    custom_diamond_title: "✍️ Enter Custom Diamond Amount",
    custom_diamond_placeholder: "Enter quantity (e.g. 85, 350, 1500...)",
    custom_diamond_hint: "Enter any diamond quantity you want (Min 10 💎)",
    custom_diamond_btn: "Apply Custom Diamonds",
    diamonds_unit: "Diamonds",
    
    // Step 3
    step_3_heading: "Select Payment Method",
    step_3_sub: "Official National Bank of Cambodia KHQR",
    khqr_title: "Bakong KHQR",
    zero_fee: "0% Fee",
    khqr_desc: "ABA Mobile, Wing, ACLEDA, Canadia, TrueMoney & all banks.",
    accepted_banks: "Accepted:",
    
    // Order Summary
    order_summary_title: "Order Summary",
    order_summary_sub: "No account login required",
    summary_player_id: "Player ID:",
    summary_zone_id: "Zone ID:",
    summary_account: "Account:",
    summary_package: "Package:",
    summary_payment: "Payment:",
    summary_total: "Total:",
    summary_total_due: "Total Due",
    pay_khqr_btn: "Pay with KHQR",
    pay_now_btn: "Pay Now",
    generating_khqr: "Generating KHQR...",
    trust_official: "Official MLBB Direct Top-Up",
    trust_instant: "Auto-dispatched in 10s",
    
    // Step Flow Buttons
    btn_ok_continue: "OK / Next Step ➔",
    btn_back: "← Back",
    btn_confirm_pay: "OK / Pay with KHQR ⚡",
    step_indicator_1: "Account",
    step_indicator_2: "Diamonds",
    step_indicator_3: "Payment",
    step_indicator_4: "Pay QR",
    step_indicator_5: "Status",
    step_change_btn: "Change",
    step_review_order: "Review & Pay",

    // Step 4 & 5 (Scan & Auto Check Status)
    scan_pay_title: "Scan to Pay with Banking App",
    scan_pay_sub: "Open ABA Mobile, Wing, ACLEDA, or any KHQR banking app and scan the QR code",
    step_5_heading: "Auto-Checking Status & Diamond Delivery",
    step_5_sub: "Live automated verification connecting directly to MLBB servers",
    stage_payment: "Bank Payment Confirmation",
    stage_payment_desc: "KHQR Bakong transaction received",
    stage_server: "Moonton Server Handshake",
    stage_server_desc: "Connecting to MLBB Game ID & Server",
    stage_diamonds: "Diamonds Delivered",
    stage_diamonds_desc: "Diamonds credited directly to in-game account",
    payment_received_title: "Payment Received! 🎉",
    payment_received_sub: "Your MLBB diamonds are being credited to your in-game account.",
    pay_success_heading: "Payment Successful! 🎉",
    pay_success_sub: "Diamonds dispatched to your Mobile Legends account!",
    diamonds_delivered: "Diamonds Delivered Successfully",
    check_paid_btn: "I Have Paid (Check Status)",
    checking_status: "Checking payment status...",
    redirecting_tracker: "Redirecting in",
    redirecting_seconds: "seconds...",
    stay_here: "Stay Here",
    success_msg: "Diamonds are on their way to your account",
    qr_failed: "Failed to load QR code",
    retry_btn: "Retry Loading",
    ref_no: "Reference No:",
    copy_btn: "Copy",
    copied_btn: "Copied",
    waiting_payment: "Auto-checking payment confirmation in real-time...",
    open_banking_app: "Open Banking App Directly",
    start_another: "Top Up Again",
    view_tracker: "View Order Receipt",
    
    // AI Assistant
    ai_title: "MLBB AI Assistant",
    ai_sub: "Smart Multi-Language Support",
    ai_ask_placeholder: "Ask anything about top-up, IDs, or payments...",
    ai_quick_1: "How to find my Player ID?",
    ai_quick_2: "Is KHQR payment instant?",
    ai_quick_3: "Supported banks in Cambodia?",
    ai_badge: "AI Powered",
    ai_send: "Send",
    ai_welcome: "👋 Hello! I am your MLBB Diamond AI Assistant. I can assist you in Khmer, English, and Chinese. How can I help you today?",

    // Footer
    footer_desc: "Premier gaming recharge platform for Mobile Legends: Bang Bang players in Cambodia and worldwide. Fast, secure, and always at the lowest rates.",
    footer_delivery: "10-Second Delivery",
    footer_delivery_desc: "Automated instant direct to game",
    footer_safe: "100% Safe Top-Up",
    footer_safe_desc: "No passwords needed, only ID",
    footer_khqr: "Bakong KHQR",
    footer_khqr_desc: "Zero fee via all Cambodia banks",
    footer_support: "24/7 Live Support",
    footer_support_desc: "Fast help via Telegram & Chat",
    footer_quick_links: "Quick Links",
    footer_payments: "Supported Payments",
    footer_telegram: "Telegram Support",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms & Conditions",
    footer_rights: "All rights reserved.",

    // Dynamic Ticker & Navigator
    ticker_1_title: "10-Second Delivery",
    ticker_1_desc: "Automated instant direct to game",
    ticker_2_title: "100% Safe Top-Up",
    ticker_2_desc: "No passwords needed, only ID",
    ticker_3_title: "Bakong KHQR",
    ticker_3_desc: "Zero fee via all Cambodia banks",
    ticker_4_title: "24/7 Live Support",
    ticker_4_desc: "Fast help via Telegram & Chat",

    nav_scroll_banner: "1 - Banner",
    nav_scroll_topup: "2 - Game TopUP",
    nav_scroll_footer: "3 - Footer / Connect",

    // Game Catalog & Search
    catalog_title: "Top-up games and services",
    catalog_sub: "Top-ups catalog for games and services.",
    catalog_search_label: "CATALOG SEARCH",
    catalog_search_placeholder: "Search by category name...",
    tab_favorites: "Favorites",
    tab_service_topup: "Service top-up",
    tab_telegram_stars: "Telegram stars",
    tab_upgrade_level: "Upgrade level",
    btn_topup_card: "Topup",

    // Event Banners
    event_banner_title: "News of Event Games & Special Offers",
    event_banner_badge: "✨ Auto-Updated Events",

    // TopUp Layout & Tabs
    layout_tiles: "Tiles",
    layout_large_icons: "Large icons",
    layout_list: "List",
    tab_all_pkgs: "All",
    tab_pass_pkgs: "Pass",
    tab_diamond_pkgs: "Diamond",
    checkout_selected_total: "Selected Item & Total",
    checkout_click_hint: "Click any item to select and proceed to instant checkout.",
  },

  km: {
    // Top Bar
    instant_delivery_banner: "⚡ សេវាដឹកជញ្ជូនភ្លាមៗ៖ ប្រព័ន្ធបញ្ចូលពេជ្រស្វ័យប្រវត្តិជាមួយ KHQR ត្រឹមតែ 10 វិនាទី!",
    
    // Navbar
    nav_home: "ទំព័រដើម",
    nav_topup: "បញ្ចូលគ្រាប់ពេជ្រ",
    nav_support: "ជំនួយ & សំណួរ",
    nav_privacy: "លក្ខខណ្ឌ & ឯកជនភាព",
    nav_terms: "លក្ខខណ្ឌប្រើប្រាស់",
    nav_admin: "គ្រប់គ្រង",
    nav_instant_btn: "បញ្ចូលពេជ្រភ្លាមៗ",
    nav_guest: "មិនបាច់ចូលគណនី",
    
    // Hero
    hero_badge: "ហាងបញ្ចូលពេជ្រ MLBB ឈានមុខគេ និងលឿនបំផុតនៅកម្ពុជា",
    hero_title_1: "បញ្ចូល",
    hero_title_highlight: "គ្រាប់ពេជ្រ MLBB",
    hero_title_2: "ក្នុងរយៈពេលប៉ុន្មានវិនាទី",
    hero_desc: "ទូទាត់ប្រាក់ដោយឥតគិតថ្លៃសេវាជាមួយ Bakong KHQR។ មិនចាំបាច់ចុះឈ្មោះ ធានាផ្លូវការ 100% និងផ្ញើគ្រាប់ពេជ្រចូលក្នុងហ្គេមភ្លាមៗ។",
    hero_btn_topup: "ចាប់ផ្តើមបញ្ចូលពេជ្រឥឡូវនេះ",
    hero_btn_support: "របៀបទិញ & ជំនួយ",
    hero_stat_delivery: "ល្បឿនទទួលបាន",
    hero_stat_orders: "ការបញ្ជាទិញរួចរាល់",
    hero_stat_trust: "ទំនុកចិត្ត",
    
    // Hero Card
    card_game_title: "បញ្ចូលពេជ្រ Mobile Legends",
    card_api_ready: "ប្រព័ន្ធស្វ័យប្រវត្តិកំពុងដំណើរការ",
    card_feat_1_title: "មិនចាំបាច់ចូលគណនី (Guest)",
    card_feat_1_desc: "ប្រើតែ Player ID និង Zone ID ប៉ុណ្ណោះ",
    card_feat_2_title: "ទូទាត់តាម Bakong KHQR",
    card_feat_2_desc: "គាំទ្រ ABA, Wing, ACLEDA, Canadia",
    card_feat_3_title: "ពិនិត្យឈ្មោះក្នុងហ្គេមផ្ទាល់",
    card_feat_3_desc: "ផ្ទៀងផ្ទាត់ឈ្មោះ Player ID មុនទូទាត់",
    card_goto_topup: "ទៅកាន់ការបញ្ចូលពេជ្រ",
    
    // Home Sections
    sec_games_badge: "ហាងហ្គេមផ្លូវការ",
    sec_games_title: "ជ្រើសរើសហ្គេមរបស់អ្នក",
    sec_games_desc: "ជ្រើសរើសហ្គេមដែលអ្នកចូលចិត្តខាងក្រោម ដើម្បីបញ្ចូលទឹកប្រាក់ស្វ័យប្រវត្តិភ្លាមៗ គ្មានកម្រៃសេវា។",
    sec_games_search_placeholder: "ស្វែងរកហ្គេម (ឧ. Mobile Legends, Free Fire...)",
    sec_games_filter_all: "ហ្គេមទាំងអស់",
    sec_games_filter_moba: "MOBA",
    sec_games_filter_br: "Battle Royale",
    sec_games_filter_rpg: "RPG & Action",
    sec_games_btn_topup: "បញ្ចូលទឹកប្រាក់ឥឡូវនេះ",
    sec_games_instant_tag: "លឿន ១០វិ",
    sec_popular_badge: "ហ្គេមពេញនិយម",
    sec_popular_title: "ជ្រើសរើសហ្គេម",
    sec_view_all: "មើលហ្គេមទាំងអស់",
    sec_buy_btn: "បញ្ចូល",
    
    // 4 Steps Guide
    steps_badge: "៤ ជំហានងាយៗ",
    steps_title: "របៀបបញ្ចូលគ្រាប់ពេជ្រ",
    steps_desc: "បញ្ចូលពេជ្រ MLBB របស់អ្នកយ៉ាងងាយស្រួល ក្នុងរយៈពេលតិចជាងមួយនាទី។",
    step1_title: "បញ្ចូល Player ID",
    step1_desc: "បញ្ចូល Player ID និង Server Zone ID របស់អ្នក។ ប្រព័ន្ធនឹងពិនិត្យឈ្មោះរបស់អ្នកស្វ័យប្រវត្តិ។",
    step2_title: "ជ្រើសរើសចំនួនពេជ្រ",
    step2_desc: "ជ្រើសរើសកញ្ចប់ពេជ្រដែលអ្នកចង់បាន ដូចជាកញ្ចប់ប្រចាំសប្តាហ៍ ឬកញ្ចប់ធំៗ។",
    step3_title: "ស្កេន Bakong KHQR",
    step3_desc: "ស្កេនកូដ KHQR ជាមួយ ABA Mobile, Wing, ACLEDA ឬកម្មវិធីធនាគារណាមួយ។",
    step4_title: "ទទួលបានពេជ្រភ្លាមៗ",
    step4_desc: "គ្រាប់ពេជ្រនឹងចូលទៅក្នុងប្រអប់សំបុត្រហ្គេម MLBB របស់អ្នកក្នុងរយៈពេល ១០ វិនាទី!",
    
    // FAQ
    faq_badge: "មានសំណួរមែនទេ?",
    faq_title: "សំណួរដែលសួរញឹកញាប់",
    
    // Bottom CTA
    cta_title: "ត្រៀមខ្លួនដើម្បីគ្រងរាជ្យសមរភូមិហើយឬនៅ?",
    cta_desc: "បញ្ចូលគ្រាប់ពេជ្រ Mobile Legends របស់អ្នកឥឡូវនេះ ដើម្បីទទួលបានវីរបុរស សម្លៀកបំពាក់ស្អាតៗ និង Passes ភ្លាមៗ។",
    cta_btn: "បញ្ចូលគ្រាប់ពេជ្រឥឡូវនេះ",
    
    // TopUp Page
    topup_header_title: "Mobile Legends: Bang Bang",
    topup_header_desc: "បញ្ចូលគ្រាប់ពេជ្រផ្ទាល់ជាមួយការផ្ទៀងផ្ទាត់ server ផ្លូវការ និងការទូទាត់លឿនតាម Bakong KHQR។",
    topup_official: "ផ្លូវការ",
    topup_instant: "10វិ ភ្លាមៗ",
    topup_online: "ដំណើរការ",
    
    // Step 1
    step_1_heading: "បញ្ចូល User ID និង Zone ID",
    where_is_id: "តើ ID នៅឯណា?",
    id_guide_title: "របៀបស្វែងរក ID ហ្គេម Mobile Legends របស់អ្នក៖",
    id_guide_1: "១. បើកហ្គេម MLBB ហើយចុចលើរូប Avatar (កម្រងរូបភាព) នៅខាងឆ្វេងខាងលើ។",
    id_guide_2: "២. រកមើល៖ User ID: 1225368571 (11446)។",
    id_guide_3: "៣. លេខខាងមុខគឺជា Player ID ហើយលេខក្នុងវង់ក្រចកគឺជា Zone ID។",
    id_guide_tip: "💡 អ្នកអាចចម្លង \"1225368571 (11446)\" ទាំងមូលមកបិទភ្ជាប់ (Paste) ក្នុងប្រអប់ Player ID បាន!",
    player_id_label: "Player ID",
    server_id_label: "Zone / Server ID",
    auto_detected: "ស្គាល់ស្វ័យប្រវត្តិ",
    paste_hint: "បិទភ្ជាប់ ID ទាំងមូលដើម្បីបំបែកស្វ័យប្រវត្តិ",
    inside_brackets: "លេខនៅក្នុងវង់ក្រចក ( )",
    check_btn: "ពិនិត្យ",
    verified_badge: "បានផ្ទៀងផ្ទាត់",
    server_label: "ម៉ាស៊ីនបម្រើ",
    
    // Step 2
    step_2_heading: "ជ្រើសរើសចំនួនគ្រាប់ពេជ្រ",
    cat_all: "ទាំងអស់",
    cat_popular: "ពេញនិយម",
    cat_bulk: "កញ្ចប់ធំ",
    cat_custom: "✍️ បញ្ចូលផ្ទាល់",
    custom_diamond_title: "✍️ បញ្ចូលចំនួនគ្រាប់ពេជ្រដោយខ្លួនឯង",
    custom_diamond_placeholder: "បញ្ចូលចំនួនពេជ្រ (ឧ. 85, 350, 1500...)",
    custom_diamond_hint: "បញ្ចូលចំនួនគ្រាប់ពេជ្រដែលអ្នកចង់បាន (យ៉ាងតិច 10 💎)",
    custom_diamond_btn: "ជ្រើសរើសចំនួននេះ",
    diamonds_unit: "គ្រាប់ពេជ្រ",
    
    // Step 3
    step_3_heading: "ជ្រើសរើសវិធីសាស្ត្រទូទាត់",
    step_3_sub: "KHQR ផ្លូវការរបស់ធនាគារជាតិនៃកម្ពុជា",
    khqr_title: "ទូទាត់តាម Bakong KHQR",
    zero_fee: "ឥតគិតថ្លៃសេវា 0%",
    khqr_desc: "ABA Mobile, Wing, ACLEDA, Canadia, TrueMoney និងធនាគារទាំងអស់។",
    accepted_banks: "ធនាគារគាំទ្រ៖",
    
    // Order Summary
    order_summary_title: "សេចក្ដីសង្ខេបនៃការបញ្ជាទិញ",
    order_summary_sub: "មិនបាច់ចូលគណនី (Guest)",
    summary_player_id: "Player ID:",
    summary_zone_id: "Zone ID:",
    summary_account: "ឈ្មោះគណនី:",
    summary_package: "កញ្ចប់ពេជ្រ:",
    summary_payment: "វិធីទូទាត់:",
    summary_total: "សរុប:",
    summary_total_due: "ចំនួនត្រូវបង់",
    pay_khqr_btn: "ទូទាត់ជាមួយ KHQR",
    pay_now_btn: "ទូទាត់ឥឡូវនេះ",
    generating_khqr: "កំពុងបង្កើត KHQR...",
    trust_official: "បញ្ចូលពេជ្រ MLBB ផ្លូវការ",
    trust_instant: "ដឹកជញ្ជូនស្វ័យប្រវត្តិក្នុង 10 វិនាទី",
    
    // Step Flow Buttons
    btn_ok_continue: "យល់ព្រម / ជំហានបន្ទាប់ ➔",
    btn_back: "← ថយក្រោយ",
    btn_confirm_pay: "យល់ព្រម / ទូទាត់ KHQR ⚡",
    step_indicator_1: "គណនី",
    step_indicator_2: "ពេជ្រ",
    step_indicator_3: "ទូទាត់",
    step_indicator_4: "ស្កេន QR",
    step_indicator_5: "ស្ថានភាព",
    step_change_btn: "កែប្រែ",
    step_review_order: "ពិនិត្យ & ទូទាត់",

    // Step 4 & 5 (Scan to Pay & Auto Check Status)
    scan_pay_title: "ស្កេនទូទាត់ជាមួយកម្មវិធីធនាគារ",
    scan_pay_sub: "បើក ABA Mobile, Wing, ACLEDA ឬកម្មវិធីធនាគារដែលមាន KHQR ហើយស្កេន QR កូដ",
    step_5_heading: "កំពុងពិនិត្យស្ថានភាពទូទាត់ & ផ្ញើពេជ្រជូនស្វ័យប្រវត្តិ",
    step_5_sub: "ប្រព័ន្ធស្វ័យប្រវត្តិកំពុងផ្ទៀងផ្ទាត់ការទូទាត់ និងភ្ជាប់ទៅម៉ាស៊ីនបម្រើ MLBB",
    stage_payment: "ការបញ្ជាក់ការទូទាត់ពីធនាគារ",
    stage_payment_desc: "បានទទួលប្រតិបត្តិការ KHQR Bakong",
    stage_server: "ការភ្ជាប់ទៅម៉ាស៊ីនបម្រើ Moonton",
    stage_server_desc: "កំពុងផ្ទៀងផ្ទាត់ Game ID និង Server ID",
    stage_diamonds: "ការផ្ញើគ្រាប់ពេជ្រចូលគណនី",
    stage_diamonds_desc: "គ្រាប់ពេជ្រត្រូវបានបញ្ចូលទៅក្នុងគណនីហ្គេមរបស់អ្នករួចរាល់",
    payment_received_title: "ទទួលបានការទូទាត់ជោគជ័យ! 🎉",
    payment_received_sub: "គ្រាប់ពេជ្រ MLBB របស់អ្នកកំពុងត្រូវបានបញ្ជូនចូលក្នុងគណនីហ្គេម។",
    pay_success_heading: "ការទូទាត់ទទួលបានជោគជ័យ! 🎉",
    pay_success_sub: "គ្រាប់ពេជ្រ MLBB ត្រូវបានបញ្ចូលទៅក្នុងគណនីរបស់អ្នករួចរាល់!",
    diamonds_delivered: "គ្រាប់ពេជ្របានបញ្ជូនជោគជ័យ",
    check_paid_btn: "ខ្ញុំបានទូទាត់រួចហើយ (ពិនិត្យភ្លាមៗ)",
    checking_status: "កំពុងពិនិត្យស្ថានភាពទូទាត់...",
    redirecting_tracker: "នឹងប្តូរទៅកាន់ទំព័រតាមដានក្នុងរយៈពេល",
    redirecting_seconds: "វិនាទី...",
    stay_here: "នៅទំព័រនេះ",
    success_msg: "គ្រាប់ពេជ្រកំពុងធ្វើដំណើរទៅកាន់គណនីរបស់អ្នក",
    qr_failed: "មិនអាចផ្ទុក QR កូដបានទេ",
    retry_btn: "ព្យាយាមម្តងទៀត",
    ref_no: "លេខយោង (Ref No):",
    copy_btn: "ចម្លង",
    copied_btn: "បានចម្លង",
    waiting_payment: "កំពុងពិនិត្យការបញ្ជាក់ការទូទាត់របស់អ្នកក្នុងពេលជាក់ស្តែង...",
    open_banking_app: "បើកកម្មវិធីធនាគារផ្ទាល់",
    start_another: "បញ្ចូលទឹកប្រាក់ម្តងទៀត",
    view_tracker: "មើលបង្កាន់ដៃបញ្ជាទិញ",
    
    // AI Assistant
    ai_title: "ជំនួយការឆ្លាតវៃ MLBB AI",
    ai_sub: "ជំនួយការបកប្រែពហុភាសា & សេវាកម្ម",
    ai_ask_placeholder: "សួរសំណួរអំពីការបញ្ចូលពេជ្រ, ID, ឬការទូទាត់...",
    ai_quick_1: "តើស្វែងរក Player ID ដោយរបៀបណា?",
    ai_quick_2: "តើការទូទាត់ KHQR ចូលភ្លាមៗទេ?",
    ai_quick_3: "តើធនាគារណាខ្លះអាចទូទាត់បាន?",
    ai_badge: "បច្ចេកវិទ្យា AI",
    ai_send: "ផ្ញើ",
    ai_welcome: "👋 សួស្តី! ខ្ញុំជាជំនួយការឆ្លាតវៃ AI បញ្ចូលពេជ្រ MLBB។ ខ្ញុំអាចជួយលោកអ្នកជាភាសាខ្មែរ អង់គ្លេស និងចិន។ តើមានអ្វីដែលខ្ញុំអាចជួយលោកអ្នកនៅថ្ងៃនេះ?",

    // Footer
    footer_desc: "វេទិកាបញ្ចូលគ្រាប់ពេជ្រឈានមុខគេសម្រាប់អ្នកលេង Mobile Legends: Bang Bang នៅកម្ពុជានិងទូទាំងពិភពលោក។ លឿន សុវត្ថិភាព និងតម្លៃទាបបំផុតជានិច្ច។",
    footer_delivery: "ដឹកជញ្ជូនក្នុង ១០ វិនាទី",
    footer_delivery_desc: "ស្វ័យប្រវត្តិផ្ទាល់ចូលក្នុងហ្គេម",
    footer_safe: "សុវត្ថិភាព ១០០%",
    footer_safe_desc: "មិនត្រូវការលេខសម្ងាត់ ត្រូវការតែ ID",
    footer_khqr: "Bakong KHQR",
    footer_khqr_desc: "ឥតគិតថ្លៃសេវាជាមួយធនាគារកម្ពុជាទាំងអស់",
    footer_support: "ជំនួយ ២៤/៧",
    footer_support_desc: "ជួយរហ័សតាម Telegram & Chat",
    footer_quick_links: "តំណភ្ជាប់រហ័ស",
    footer_payments: "ការទូទាត់ដែលគាំទ្រ",
    footer_telegram: "ជំនួយតាម Telegram",
    footer_privacy: "គោលការណ៍ឯកជនភាព",
    footer_terms: "លក្ខខណ្ឌប្រើប្រាស់",
    footer_rights: "រក្សាសិទ្ធិគ្រប់យ៉ាង។",

    // Dynamic Ticker & Navigator
    ticker_1_title: "ដឹកជញ្ជូនក្នុង ១០ វិនាទី",
    ticker_1_desc: "ស្វ័យប្រវត្តិផ្ទាល់ចូលក្នុងហ្គេម",
    ticker_2_title: "សុវត្ថិភាព ១០០%",
    ticker_2_desc: "មិនត្រូវការលេខសម្ងាត់ ត្រូវការតែ ID",
    ticker_3_title: "Bakong KHQR",
    ticker_3_desc: "ឥតគិតថ្លៃសេវាជាមួយធនាគារកម្ពុជាទាំងអស់",
    ticker_4_title: "ជំនួយ ២៤/៧",
    ticker_4_desc: "ជួយរហ័សតាម Telegram & Chat",

    nav_scroll_banner: "1 - បដា/ទំព័រដើម",
    nav_scroll_topup: "2 - សេវាបញ្ចូលហ្គេម",
    nav_scroll_footer: "3 - ព័ត៌មាន & ទំនាក់ទំនង",

    // Game Catalog & Search
    catalog_title: "បញ្ចូលហ្គេម និងសេវាកម្ម",
    catalog_sub: "កាតាឡុកបញ្ចូលទឹកប្រាក់សម្រាប់ហ្គេម និងសេវាកម្មទាំងអស់។",
    catalog_search_label: "ស្វែងរកកាតាឡុក",
    catalog_search_placeholder: "ស្វែងរកតាមឈ្មោះ ឬប្រភេទ...",
    tab_favorites: "សំណព្វចិត្ត",
    tab_service_topup: "សេវាបញ្ចូលហ្គេម",
    tab_telegram_stars: "Telegram Stars",
    tab_upgrade_level: "បង្កើនកម្រិត",
    btn_topup_card: "បញ្ចូល",

    // Event Banners
    event_banner_title: "ព័ត៌មានព្រឹត្តិការណ៍ហ្គេម & ការផ្ដល់ជូនពិសេស",
    event_banner_badge: "✨ ព្រឹត្តិការណ៍ថ្មីៗជានិច្ច",

    // TopUp Layout & Tabs
    layout_tiles: "ក្រឡា",
    layout_large_icons: "រូបធំ",
    layout_list: "បញ្ជី",
    tab_all_pkgs: "ទាំងអស់",
    tab_pass_pkgs: "សំបុត្រពិសេស",
    tab_diamond_pkgs: "ពេជ្រ",
    checkout_selected_total: "ទំនិញដែលបានជ្រើសរើស និងសរុប",
    checkout_click_hint: "ចុចលើកញ្ចប់ណាមួយដើម្បីជ្រើសរើស និងបន្តការទូទាត់ភ្លាមៗ។",
  },

  zh: {
    // Top Bar
    instant_delivery_banner: "⚡ 极速充值已开启：KHQR 自动充值仅需 10 秒即时到账！",
    
    // Navbar
    nav_home: "首页",
    nav_topup: "钻石充值",
    nav_support: "帮助与常见问题",
    nav_privacy: "隐私与条款",
    nav_terms: "服务条款",
    nav_admin: "管理后台",
    nav_instant_btn: "立即极速充值",
    nav_guest: "游客极速免登",
    
    // Hero
    hero_badge: "柬埔寨第一极速 MLBB 无尽对决钻石商城",
    hero_title_1: "秒级充值",
    hero_title_highlight: "MLBB 无尽对决钻石",
    hero_title_2: "极速到账",
    hero_desc: "使用 Bakong KHQR 尊享 0 手续费便捷扫码支付。无需注册账号，100% 官方正品保障，充值直充游戏内邮箱。",
    hero_btn_topup: "立即开始充值",
    hero_btn_support: "充值教程与帮助",
    hero_stat_delivery: "平均到账速度",
    hero_stat_orders: "已完成订单",
    hero_stat_trust: "用户信赖评分",
    
    // Hero Card
    card_game_title: "无尽对决 (MLBB) 钻石充值",
    card_api_ready: "官方直连接口在线",
    card_feat_1_title: "无需登录账号 (游客模式)",
    card_feat_1_desc: "仅需提供游戏 User ID 与区服 ID",
    card_feat_2_title: "Bakong KHQR 柬埔寨银联扫码",
    card_feat_2_desc: "支持 ABA, Wing, ACLEDA, 加华银行等",
    card_feat_3_title: "实时游戏昵称校对",
    card_feat_3_desc: "付款前自动核对游戏角色名字防填错",
    card_goto_topup: "进入充值页面",
    
    // Home Sections
    sec_games_badge: "官方正品游戏商城",
    sec_games_title: "选择您的充值游戏",
    sec_games_desc: "在下方选择您喜爱的游戏，享受极速 10 秒自动充值与 0 手续费优惠。",
    sec_games_search_placeholder: "搜索游戏 (如 Mobile Legends, Free Fire...)",
    sec_games_filter_all: "全部游戏",
    sec_games_filter_moba: "MOBA 竞技",
    sec_games_filter_br: "吃鸡射击",
    sec_games_filter_rpg: "RPG 角色扮演",
    sec_games_btn_topup: "立即充值",
    sec_games_instant_tag: "10秒直充",
    sec_popular_badge: "热门游戏",
    sec_popular_title: "选择游戏",
    sec_view_all: "查看全部游戏",
    sec_buy_btn: "充值",
    
    // 4 Steps Guide
    steps_badge: "简单 4 步",
    steps_title: "如何充值钻石",
    steps_desc: "不到一分钟即可轻松完成您的 MLBB 钻石充值。",
    step1_title: "输入玩家 ID",
    step1_desc: "输入您的 MLBB User ID 与 Zone ID，系统将自动核实您的游戏昵称。",
    step2_title: "选择钻石数量",
    step2_desc: "选择您需要的充值套餐，包括周卡、月卡及超值大额钻石包。",
    step3_title: "扫码 Bakong KHQR",
    step3_desc: "使用 ABA Mobile、Wing、ACLEDA 或任意银行 App 扫描动态二维码。",
    step4_title: "秒级到账",
    step4_desc: "10 秒内钻石将自动直接发送至您的 MLBB 游戏内邮箱！",
    
    // FAQ
    faq_badge: "遇到问题？",
    faq_title: "常见问题解答",
    
    // Bottom CTA
    cta_title: "准备好统治战场了吗？",
    cta_desc: "立即充值 Mobile Legends 钻石，秒速解锁您喜爱的英雄、史诗皮肤与通行证。",
    cta_btn: "立即充值钻石",
    
    // TopUp Page
    topup_header_title: "无尽对决 (Mobile Legends: Bang Bang)",
    topup_header_desc: "直充钻石，官方服务器实时核对，Bakong KHQR 极速扫码结算。",
    topup_official: "官方正品",
    topup_instant: "10秒直充",
    topup_online: "服务在线",
    
    // Step 1
    step_1_heading: "输入 User ID 与 Zone ID",
    where_is_id: "在哪里查看 ID？",
    id_guide_title: "如何找到您的 Mobile Legends ID：",
    id_guide_1: "1. 打开游戏，点击左上角的头像进入个人资料。",
    id_guide_2: "2. 在名字下方查看：User ID: 1225368571 (11446)。",
    id_guide_3: "3. 前面数字为 Player ID，括号内数字为 Zone ID (区服)。",
    id_guide_tip: "💡 您可以直接复制 \"1225368571 (11446)\" 粘贴至输入框，系统将自动拆分！",
    player_id_label: "玩家 ID (Player ID)",
    server_id_label: "区服 ID (Zone / Server ID)",
    auto_detected: "已自动识别",
    paste_hint: "可直接粘贴完整 ID 文本自动识别",
    inside_brackets: "括号 ( ) 内的数字",
    check_btn: "核对昵称",
    verified_badge: "已核对",
    server_label: "区服",
    
    // Step 2
    step_2_heading: "选择充值钻石数量",
    cat_all: "全部",
    cat_popular: "热销",
    cat_bulk: "超值大额",
    cat_custom: "✍️ 自定义",
    custom_diamond_title: "✍️ 自定义输入钻石数量",
    custom_diamond_placeholder: "输入钻石数量 (例如 85, 350, 1500...)",
    custom_diamond_hint: "输入任意所需钻石数 (最低 10 💎)",
    custom_diamond_btn: "确认此数量",
    diamonds_unit: "钻石",
    
    // Step 3
    step_3_heading: "选择支付方式",
    step_3_sub: "柬埔寨国家银行官方 KHQR",
    khqr_title: "Bakong KHQR 扫码支付",
    zero_fee: "0 手续费",
    khqr_desc: "支持 ABA Mobile、Wing、ACLEDA、加华银行、TrueMoney 等全部银行。",
    accepted_banks: "支持银行：",
    
    // Order Summary
    order_summary_title: "订单明细汇总",
    order_summary_sub: "免登录即可完成充值",
    summary_player_id: "玩家 ID:",
    summary_zone_id: "区服 ID:",
    summary_account: "游戏昵称:",
    summary_package: "充值套餐:",
    summary_payment: "支付方式:",
    summary_total: "实付总额:",
    summary_total_due: "应付金额",
    pay_khqr_btn: "使用 KHQR 支付",
    pay_now_btn: "立即付款",
    generating_khqr: "正在生成 KHQR...",
    trust_official: "MLBB 官方直充认证",
    trust_instant: "10 秒自动发货到账",
    
    // Step Flow Buttons
    btn_ok_continue: "确认 / 下一步 ➔",
    btn_back: "← 返回上一步",
    btn_confirm_pay: "确认 / 极速扫码支付 ⚡",
    step_indicator_1: "账号",
    step_indicator_2: "钻石",
    step_indicator_3: "支付",
    step_indicator_4: "扫码支付",
    step_indicator_5: "状态追踪",
    step_change_btn: "更改",
    step_review_order: "核对并支付",

    // Step 4 & 5 (Scan to Pay & Auto Check Status)
    scan_pay_title: "使用手机银行 App 扫码支付",
    scan_pay_sub: "打开 ABA Mobile、Wing、ACLEDA 或任意支持 KHQR 的银行 App 扫描二维码",
    step_5_heading: "正在自动检查支付状态并直充钻石",
    step_5_sub: "全自动订单监控系统正在连接 Moonton 官方服务器",
    stage_payment: "银行付款确认",
    stage_payment_desc: "已接收 Bakong KHQR 付款交易",
    stage_server: "Moonton 服务器握手",
    stage_server_desc: "正在校验游戏 ID 和服务器区服",
    stage_diamonds: "钻石极速直充",
    stage_diamonds_desc: "钻石已成功充入您的 MLBB 游戏账户",
    payment_received_title: "支付成功！🎉",
    payment_received_sub: "您的 MLBB 钻石正在极速发往您的游戏账号中。",
    pay_success_heading: "支付成功！🎉",
    pay_success_sub: "MLBB 钻石已成功充值至您的游戏账号！",
    diamonds_delivered: "钻石充值成功",
    check_paid_btn: "我已付款 (立即检查)",
    checking_status: "正在查询支付状态...",
    redirecting_tracker: "秒后自动跳转至订单详情",
    redirecting_seconds: "秒...",
    stay_here: "留在当前页",
    success_msg: "钻石已发送至您的游戏邮箱，请注意查收",
    qr_failed: "二维码加载失败",
    retry_btn: "重试加载",
    ref_no: "订单参考号 (Ref No):",
    copy_btn: "复制",
    copied_btn: "已复制",
    waiting_payment: "正在实时监听付款确认中...",
    open_banking_app: "直接打开手机银行 App",
    start_another: "再来一单",
    view_tracker: "查看订单收据",
    
    // AI Assistant
    ai_title: "MLBB 智能 AI 助手",
    ai_sub: "智能多语言翻译与客服",
    ai_ask_placeholder: "询问关于充值、找回 ID、支付方式等问题...",
    ai_quick_1: "如何查看我的玩家 ID？",
    ai_quick_2: "KHQR 支付是否即时到账？",
    ai_quick_3: "支持哪些柬埔寨银行？",
    ai_badge: "AI 驱动",
    ai_send: "发送",
    ai_welcome: "👋 您好！我是您的 MLBB 钻石充值 AI 智能助手。我精通高棉语、英语和中文。今天有什么可以为您效劳的？",

    // Footer
    footer_desc: "面向柬埔寨及全球 Mobile Legends: Bang Bang 玩家的顶级游戏直充平台。速度快、安全可靠、价格实惠。",
    footer_delivery: "10秒极速到账",
    footer_delivery_desc: "全自动直充至游戏邮箱",
    footer_safe: "100% 账号安全",
    footer_safe_desc: "无需提供密码，仅需 ID",
    footer_khqr: "Bakong KHQR",
    footer_khqr_desc: "柬埔寨全部银行扫码 0 手续费",
    footer_support: "24/7 在线客服",
    footer_support_desc: "Telegram 及实时客服全天候守护",
    footer_quick_links: "快捷导航",
    footer_payments: "支持支付方式",
    footer_telegram: "Telegram 客服",
    footer_privacy: "隐私政策",
    footer_terms: "服务条款",
    footer_rights: "版权所有。",

    // Dynamic Ticker & Navigator
    ticker_1_title: "10秒极速到账",
    ticker_1_desc: "全自动直充至游戏邮箱",
    ticker_2_title: "100% 账号安全",
    ticker_2_desc: "无需提供密码，仅需 ID",
    ticker_3_title: "Bakong KHQR",
    ticker_3_desc: "柬埔寨全部银行扫码 0 手续费",
    ticker_4_title: "24/7 在线客服",
    ticker_4_desc: "Telegram 及实时客服全天候守护",

    nav_scroll_banner: "1 - 顶部横幅",
    nav_scroll_topup: "2 - 游戏充值",
    nav_scroll_footer: "3 - 底部/联系",

    // Game Catalog & Search
    catalog_title: "游戏与增值服务充值",
    catalog_sub: "官方游戏及增值服务全品类充值目录。",
    catalog_search_label: "目录搜索",
    catalog_search_placeholder: "按游戏或类别名称搜索...",
    tab_favorites: "我的收藏",
    tab_service_topup: "官方充值",
    tab_telegram_stars: "Telegram 星星",
    tab_upgrade_level: "代练升级",
    btn_topup_card: "立即充值",

    // Event Banners
    event_banner_title: "游戏最新活动与特惠公告",
    event_banner_badge: "✨ 实时更新活动",

    // TopUp Layout & Tabs
    layout_tiles: "瓦片视图",
    layout_large_icons: "大图标",
    layout_list: "列表",
    tab_all_pkgs: "全部",
    tab_pass_pkgs: "通行证",
    tab_diamond_pkgs: "钻石",
    checkout_selected_total: "已选商品与总计",
    checkout_click_hint: "点击任意套餐以选择并进入快速结账。",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('mlbb_topup_lang') || 'en';
  });

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('mlbb_topup_lang', lang);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
