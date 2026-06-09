const BOARD_SIZE = 10;
const boardEl = document.getElementById('board');

let state = {
    board: [],
    turn: 'blue',
    mode: 'pvp',
    diff: 'easy',
    selected: null,
    moves: [],
    comboMode: false,
    aiThinking: false,
    gameEnded: false
};

let activeSkin = 'default';
let activePattern = 'solid';
let currentLang = 'en';
let boardHistory = []; 
let audioMuted = false;
let audioCtx = null;

const translations = {
    en: {
        gameTitle: "GAME", gameSubtitle: "Hunter AI Upgrade", modePvp: "2 Player Match", modeNpc: "NPC Opponent",
        levelTitle: "SELECT", levelSubtitle: "Select NPC Search Tree Depth", diffEasy: "Easy", diffMedium: "Intermediate",
        diffHard: "Hard (Extreme Aggression)", backBtn: "Back to Main Menu", sysState: "System State",
        p1UnitsLabel: "Your Units (Blue)", p2UnitsLabel: "Enemy Units (Red)", terminateBtn: "Terminate Game",
        statusLabel: "Current Status", statusReady: "READY", configModeLabel: "Config Mode", themesTitle: "Board Themes",
        themeDefault: "Default", themeClassic: "Classic", themeCyber: "Cyber", themeRoyal: "Royal",
        patternTitle: "Piece Pattern", patSolid: "Solid Glow", patRing: "Holo Ring", patStripes: "Cyber Stripe",
        customColorsTitle: "Custom Unit Colors", unitsCount: "Units", turnYour: "YOUR TURN", turnP2: "PLAYER 2 TURN",
        turnNpc: "NPC TURN", npcTargeting: "NPC TARGETING...", winNpc: "Game Over! NPC/Red Wins!", winPlayer: "Victory! Blue Wins!",
        undoBtn: "Undo Move", historyLogLabel: "Combat History",
        logMove: "Moved to", logCapture: "Captured unit at", logKing: "Promoted to King!", logUndo: "Reverted previous turn.",
        textWin: "YOU WIN", textLose: "YOU LOSE", textP1Win: "PLAYER 1 WINS", textP2Win: "PLAYER 2 WINS",
        hunterNotice: "<i class='fa-solid fa-crosshairs'></i> <b>Hunter Override Active:</b> The NPC scans aggressively for targets. It will actively look to eliminate pieces whenever a line opens!"
    },
    ja: {
        gameTitle: "ゲーム", gameSubtitle: "ハンター AI アップグレード", modePvp: "2人対戦マッチ", modeNpc: "NPC対戦相手",
        levelTitle: "選択", levelSubtitle: "NPCの探索ツリー深度を選択", diffEasy: "イージー", diffMedium: "インテリジェント",
        diffHard: "ハード (極限の攻撃性)", backBtn: "メインメニューに戻る", sysState: "システムステート",
        p1UnitsLabel: "あなたのユニット (青)", p2UnitsLabel: "敵のユニット (赤)", terminateBtn: "ゲームを終了する",
        statusLabel: "現在のステータス", statusReady: "準備完了", configModeLabel: "構成モード", themesTitle: "ボードテーマ",
        themeDefault: "デフォルト", themeClassic: "クラシック", themeCyber: "サイバー", themeRoyal: "ロイヤル",
        patternTitle: "コマのパターン", patSolid: "ソリッドグロウ", patRing: "ホロリング", patStripes: "サイバーストライプ",
        customColorsTitle: "カスタムユニットカラー", unitsCount: "個", turnYour: "あなたのターン", turnP2: "プレイヤー2のターン",
        turnNpc: "NPCのターン", npcTargeting: "NPC索敵中...", winNpc: "ゲームオーバー！NPC（赤）の勝利！", winPlayer: "勝利！プレイヤー（青）の勝ち！",
        undoBtn: "一手戻す", historyLogLabel: "戦闘履歴",
        logMove: "移動しました：", logCapture: "敵ユニットを撃破：", logKing: "キングに昇格！", logUndo: "前のターンを取り消しました。",
        textWin: "あなたの勝利", textLose: "敗北しました", textP1Win: "プレイヤー1の勝利", textP2Win: "プレイヤー2の勝利",
        hunterNotice: "<i class='fa-solid fa-crosshairs'></i> <b>ハンターオーバーライド有効:</b> NPCはターゲットを激しくスキャンします。ラインが開くと積極的に駒の排除を狙います！"
    },
    th: {
        gameTitle: "กระดาน", gameSubtitle: "ฮันเตอร์ AI อัปเกรด", modePvp: "แมตช์ผู้เล่น 2 คน", modeNpc: "คู่ต่อสู้ NPC",
        levelTitle: "เลือก", levelSubtitle: "เลือกระดับความลึกของแผนภูมิ NPC", diffEasy: "ง่าย", diffMedium: "ปานกลาง",
        diffHard: "ยาก (โจมตีดุดัน)", backBtn: "กลับสู่เมนูหลัก", sysState: "สถานะระบบ",
        p1UnitsLabel: "ยูนิตของคุณ (น้ำเงิน)", p2UnitsLabel: "ยูนิตศัตรู (แดง)", terminateBtn: "ยกเลิกเกม",
        statusLabel: "สถานะปัจจุบัน", statusReady: "พร้อม", configModeLabel: "โหมดกำหนดค่า", themesTitle: "ธีมกระดาน",
        themeDefault: "เริ่มต้น", themeClassic: "คลาสสิก", themeCyber: "ไซเบอร์", themeRoyal: "รอยัล",
        patternTitle: "ลวดลายหมาก", patSolid: "เรืองแสง", patRing: "โฮโลริง", patStripes: "ไซเบอร์สไตรป์",
        customColorsTitle: "ปรับแต่งสียูนิต", unitsCount: "ยูนิต", turnYour: "ตาของคุณ", turnP2: "ตาของผู้เล่น 2",
        turnNpc: "ตาของ NPC", npcTargeting: "NPC กำลังคำวณ...", winNpc: "จบเกม! NPC/สีแดง เป็นฝ่ายชนะ!", winPlayer: "ยินดีด้วย! สีน้ำเงิน เป็นฝ่ายชนะ!",
        undoBtn: "ย้อนกลับ", historyLogLabel: "บันทึกการต่อสู้",
        logMove: "เดินหมากไปที่", logCapture: "กินหมากที่ตำแหน่ง", logKing: "หงายหมากเป็นคิง!", logUndo: "ย้อนกลับการเดินหมากก่อนหน้า",
        textWin: "คุณชนะ!", textLose: "คุณแพ้!", textP1Win: "ผู้เล่น 1 ชนะ!", textP2Win: "ผู้เล่น 2 ชนะ!",
        hunterNotice: "<i class='fa-solid fa-crosshairs'></i> <b>เปิดใช้งานระบบล่าเป้าหมาย:</b> NPC สแกนหาเป้าหมายอย่างดุกัน มันจะพยายามกำจัดหมากของคุณทันทีที่มีโอกาส!"
    },
    vi: {
        gameTitle: "CỜ VÂY", gameSubtitle: "Nâng Cấp Hunter AI", modePvp: "Trận Đấu 2 Người", modeNpc: "Đối Thủ NPC",
        levelTitle: "LỰA CHỌN", levelSubtitle: "Chọn độ sâu cây tìm kiếm NPC", diffEasy: "Dễ", diffMedium: "Trung Bình",
        diffHard: "Khó (Tấn Công Cực Đoan)", backBtn: "Quay lại Menu Chính", sysState: "Trạng Thái Hệ Thống",
        p1UnitsLabel: "Quân Của Bạn (Xanh)", p2UnitsLabel: "Quân Đối Thủ (Đỏ)", terminateBtn: "Chấm Dứt Trận Đấu",
        statusLabel: "Trạng Thái Hiện Tại", statusReady: "SẴN SÀNG", configModeLabel: "Chế Độ Cấu Hình", themesTitle: "Giao Diện Bàn Cờ",
        themeDefault: "Mặc Định", themeClassic: "Cổ Điển", themeCyber: "Công Nghệ", themeRoyal: "Hoàng Gia",
        patternTitle: "Mẫu Quân Cờ", patSolid: "Phát Sáng", patRing: "Vòng Holo", patStripes: "Sọc Cyber",
        customColorsTitle: "Tùy Chỉnh Màu Quân", unitsCount: "Quân", turnYour: "LƯỢT CỦA BẠN", turnP2: "LƯỢT NGƯỜI CHƠI 2",
        turnNpc: "LƯỢT NPC", npcTargeting: "NPC ĐANG QUÉT...", winNpc: "Trò Chơi Kết Thúc! NPC/Đỏ Thắng!", winPlayer: "Chiến Thắng! Quân Xanh Thắng!",
        undoBtn: "Hoàn Tác", historyLogLabel: "Lịch Sử Trận Đấu",
        logMove: "Đã di chuyển tới", logCapture: "Đã tiêu diệt quân tại", logKing: "Đã phong cấp lên Vua!", logUndo: "Đã hoàn tác lượt đi trước đó.",
        textWin: "BẠN THẮNG", textLose: "BẠN THUA", textP1Win: "NGƯỜI CHƠI 1 THẮNG", textP2Win: "NGƯỜI CHƠI 2 THẮNG",
        hunterNotice: "<i class='fa-solid fa-crosshairs'></i> <b>Kích Hoạt Hunter Override:</b> NPC quét mục tiêu cực kỳ hung hãn. Nó sẽ chủ động tiêu diệt các quân cờ ngay khi có khoảng trống!"
    },
    my: {
        gameTitle: "ဘုတ်ဂိမ်း", gameSubtitle: "မုဆိုး AI အဆင့်မြှင့်တင်မှု", modePvp: "၂ ယောက်တွဲပွဲစဉ်", modeNpc: "NPC ပြိုင်ဘက်",
        levelTitle: "ရွေးချယ်ရန်", levelSubtitle: "NPC ရှာဖွေမှု အနက်ကို ရွေးချယ်ပါ", diffEasy: "လွယ်ကူ", diffMedium: "အလယ်အလတ်",
        diffHard: "ခက်ခဲ (အလွန်ပြင်းထန်သော တိုက်စစ်)", backBtn: "ပြင်ဆင်မှုမုဒ်သို့ ပြန်သွားရန်", sysState: "စနစ်အခြေအနေ",
        p1UnitsLabel: "သင်၏ယူနစ် (အပြာ)", p2UnitsLabel: "ရန်သူ့ယူနစ် (အနီ)", terminateBtn: "ဂိမ်းရပ်ဆိုင်းရန်",
        statusLabel: "လက်ရှိအခြေအနေ", statusReady: "အဆင်သင့်", configModeLabel: "ပြင်ဆင်မှုမုဒ်", themesTitle: "ဘုတ်ဒီဇိုင်းများ",
        themeDefault: "ပုံမှန်", themeClassic: "ဂန္ထဝင်", themeCyber: "ဆိုက်ဘာ", themeRoyal: "တော်ဝင်",
        patternTitle: "ရုပ်ပုံပုံစံ", patSolid: "တောက်ပမှု", patRing: "ဟိုလိုကွင်း", patStripes: "ဆိုက်ဘာအစင်း",
        customColorsTitle: "စိတ်ကြိုက်အရောင်ပြောင်းရန်", unitsCount: "ခု", turnYour: "သင့်အလှည့်", turnP2: "ကစားသမား ၂ အလှည့်",
        turnNpc: "NPC အလှည့်", npcTargeting: "NPC ပစ်မှတ်ရှာနေသည်...", winNpc: "ဂိမ်းပြီးဆုံးပါပြီ! NPC/အနီ အနိုင်ရရှိသည်!", winPlayer: "အောင်ပွဲ! အပြာ အနိုင်ရရှိသည်!",
        undoBtn: "နောက်ပြန်ဆုတ်", historyLogLabel: "တိုက်ပွဲမှတ်တမ်း",
        logMove: "ရွှေ့လိုက်သည့်နေရာ", logCapture: "စားလိုက်သည့်နေရာ", logKing: "ဘုရင်အဖြစ် တိုးမြှင့်လိုက်ပြီ!", logUndo: "ယခင်အလှည့်ကို ပြန်ဖျက်လိုက်သည်။",
        textWin: "သင်နိုင်သည်", textLose: "သင်ရှုံးသည်", textP1Win: "ကစားသမား ၁ နိုင်သည်", textP2Win: "ကစားသမား ၂ နိုင်သည်",
        hunterNotice: "<i class='fa-solid fa-crosshairs'></i> <b>မုဆိုးစနစ် အသက်ဝင်နေသည်:</b> NPC သည် ပစ်မှတ်များကို ပြင်းထန်စွာ ရှာဖွေနေပါသည်။ လမ်းကြောင်းပွင့်သည်နှင့် အကွက်များကို ချက်ချင်းစားရန် ကြိုစားလိမ့်မည်။"
    }
};

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (audioMuted) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        
        if (type === 'select') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.08);
            osc.start(now); osc.stop(now + 0.08);
        } else if (type === 'move') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(250, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.12);
            gain.gain.setValueAtTime(0.08, now); gain.gain.linearRampToValueAtTime(0, now + 0.12);
            osc.start(now); osc.stop(now + 0.12);
        } else if (type === 'capture') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.25);
            gain.gain.setValueAtTime(0.15, now); gain.gain.linearRampToValueAtTime(0, now + 0.25);
            osc.start(now); osc.stop(now + 0.25);
        } else if (type === 'king') {
            osc.type = 'square'; osc.frequency.setValueAtTime(300, now);
            osc.frequency.setValueAtTime(450, now + 0.08);
            osc.frequency.setValueAtTime(600, now + 0.16);
            gain.gain.setValueAtTime(0.06, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'gamewin') {
            osc.type = 'sine';
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            });
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now); osc.stop(now + 0.6);
        } else if (type === 'gamelose') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.6);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now); osc.stop(now + 0.6);
        }
    } catch(e) {}
}

function toggleMute() {
    audioMuted = !audioMuted;
    document.getElementById('sfx-btn').innerHTML = audioMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
}

function appendToLog(msg, colorClass = '') {
    const terminal = document.getElementById('log-terminal');
    if (!terminal) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${colorClass}`;
    entry.innerHTML = `&gt; ${msg}`;
    terminal.appendChild(entry);
    terminal.scrollTop = terminal.scrollHeight;
}

function changeLanguage(langCode) {
    currentLang = langCode;
    document.querySelectorAll('.lang-grid .lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${langCode}`).classList.add('active');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (key === 'hunterNotice') el.innerHTML = translations[currentLang][key];
            else el.textContent = translations[currentLang][key];
        }
    });

    if (document.getElementById('screen-game').classList.contains('active')) {
        updateUI();
        let bCount = 0, rCount = 0;
        state.board.flat().forEach(p => { if (p?.type === 'blue') bCount++; else if (p?.type === 'red') rCount++; });
        document.getElementById('p1-score').textContent = `${bCount} ${translations[currentLang].unitsCount}`;
        document.getElementById('p2-score').textContent = `${rCount} ${translations[currentLang].unitsCount}`;
        document.getElementById('diff-label').textContent = state.mode === 'pvp' ? 'PVP' : `NPC (${state.diff.toUpperCase()})`;
    }
}

function toggleThemeMode() {
    const body = document.body;
    const icon = document.querySelector('#theme-btn i');
    body.classList.toggle('light-theme');
    icon.className = body.classList.contains('light-theme') ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

function changeBoardSkin(skinType) {
    activeSkin = skinType;
    const root = document.documentElement;
    document.querySelectorAll('.board-palette-grid .palette-btn').forEach(btn => {
        if(btn.id.startsWith('skin-')) btn.classList.remove('active');
    });
    document.getElementById(`skin-${skinType}`).classList.add('active');

    switch(skinType) {
        case 'wood':
            root.style.setProperty('--tile-dark', '#78350f'); root.style.setProperty('--tile-light', '#fef3c7');
            root.style.setProperty('--tile-light-opacity', '0.7'); root.style.setProperty('--board-edge', '#451a03');
            break;
        case 'neon':
            root.style.setProperty('--tile-dark', '#1e1b4b'); root.style.setProperty('--tile-light', '#06b6d4');
            root.style.setProperty('--tile-light-opacity', '0.25'); root.style.setProperty('--board-edge', '#0f172a');
            break;
        case 'crimson':
            root.style.setProperty('--tile-dark', '#4c0519'); root.style.setProperty('--tile-light', '#e2e8f0');
            root.style.setProperty('--tile-light-opacity', '0.3'); root.style.setProperty('--board-edge', '#1e293b');
            break;
        case 'default':
        default:
            root.style.setProperty('--tile-dark', '#166534'); root.style.setProperty('--tile-light', '#334155');
            root.style.setProperty('--tile-light-opacity', '0.15'); root.style.setProperty('--board-edge', '#000000');
            break;
    }
}

function changePiecePattern(patternType) {
    activePattern = patternType;
    document.querySelectorAll('.board-palette-grid .palette-btn').forEach(btn => {
        if(btn.id.startsWith('pat-')) btn.classList.remove('active');
    });
    document.getElementById(`pat-${patternType}`).classList.add('active');
    render();
}

function updatePieceColors() {
    const root = document.documentElement;
    const p1Hex = document.getElementById('p1-picker').value;
    const p2Hex = document.getElementById('p2-picker').value;
    root.style.setProperty('--p1-color-1', p1Hex);
    root.style.setProperty('--p1-color-2', adjustBrightness(p1Hex, -40));
    root.style.setProperty('--p1-border', adjustBrightness(p1Hex, -60));
    root.style.setProperty('--p2-color-1', p2Hex);
    root.style.setProperty('--p2-color-2', adjustBrightness(p2Hex, -40));
    root.style.setProperty('--p2-border', adjustBrightness(p2Hex, -60));
}

function adjustBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16), G = parseInt(hex.substring(3, 5), 16), B = parseInt(hex.substring(5, 7), 16);
    R = parseInt((R * (100 + percent)) / 100); G = parseInt((G * (100 + percent)) / 100); B = parseInt((B * (100 + percent)) / 100);
    R = (R < 255) ? R : 255; G = (G < 255) ? G : 255; B = (B < 255) ? B : 255;
    R = (R > 0) ? R : 0; G = (G > 0) ? G : 0; B = (B > 0) ? B : 0;
    return `#${R.toString(16).padStart(2,'0')}${G.toString(16).padStart(2,'0')}${B.toString(16).padStart(2,'0')}`;
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(id);
    if (targetScreen) targetScreen.classList.add('active');
}

function setMode(mode, diff = 'easy') {
    state.mode = mode;
    state.diff = diff;
    state.gameEnded = false;
    document.getElementById('endgame-sign').style.display = 'none';
    document.getElementById('diff-label').textContent = mode === 'pvp' ? 'PVP' : `NPC (${diff.toUpperCase()})`;
    showScreen('screen-game');
    document.getElementById('log-terminal').innerHTML = '';
    boardHistory = [];
    initBoard();
}

function abortGame() {
    state.selected = null; state.moves = []; state.comboMode = false; state.aiThinking = false; state.gameEnded = true;
    document.getElementById('endgame-sign').style.display = 'none';
    showScreen('screen-main');
}

function initBoard() {
    state.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    state.turn = 'blue'; state.selected = null; state.moves = []; state.comboMode = false; state.aiThinking = false;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if ((r + c) % 2 === 1) { 
                if (r < 4) state.board[r][c] = { type: 'red', king: false };
                else if (r > 5) state.board[r][c] = { type: 'blue', king: false };
            }
        }
    }
    render();
}

function saveHistorySnapshot() {
    boardHistory.push({
        board: cloneBoard(state.board),
        turn: state.turn,
        comboMode: state.comboMode,
        selected: state.selected ? { ...state.selected } : null
    });
}

function undoMove() {
    if (state.aiThinking || state.gameEnded || boardHistory.length === 0) return;
    
    let previous = boardHistory.pop();
    if (state.mode === 'npc' && previous.turn === 'red' && boardHistory.length > 0) {
        previous = boardHistory.pop();
    }

    state.board = previous.board;
    state.turn = previous.turn;
    state.comboMode = previous.comboMode;
    state.selected = previous.selected;
    state.moves = [];
    
    playSound('move');
    appendToLog(translations[currentLang].logUndo);
    render();
}

function render() {
    boardEl.innerHTML = '';
    let bCount = 0, rCount = 0;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r+c)%2 === 1 ? 'green' : 'white'}`;
            sq.id = `sq-${r}-${c}`;
            
            const piece = state.board[r][c];
            if (piece) {
                if (piece.type === 'blue') bCount++; else rCount++;
                const pEl = document.createElement('div');
                pEl.className = `piece pattern-${activePattern} ${piece.type}-piece ${piece.king ? 'king' : ''}`;
                if (state.selected && state.selected.r === r && state.selected.c === c) pEl.classList.add('selected');
                
                if (!state.aiThinking && !state.gameEnded && (state.mode === 'pvp' || state.turn === 'blue')) {
                    pEl.onclick = (e) => {
                        e.stopPropagation();
                        selectPiece(r, c);
                    };
                }
                sq.appendChild(pEl);
            }

            const move = state.moves.find(m => m.r === r && m.c === c);
            if (move && !state.aiThinking && !state.gameEnded) {
                sq.classList.add('move-hint');
                sq.onclick = () => executeMove(move);
            }
            boardEl.appendChild(sq);
        }
    }

    document.getElementById('p1-score').textContent = `${bCount} ${translations[currentLang].unitsCount}`;
    document.getElementById('p2-score').textContent = `${rCount} ${translations[currentLang].unitsCount}`;
    updateUI();
}

function updateUI() {
    const status = document.getElementById('game-status');
    const p1 = document.getElementById('p1-stats');
    const p2 = document.getElementById('p2-stats');

    if (state.gameEnded) {
        status.textContent = "TERMINATED";
        status.style.color = 'var(--text-dim)';
        return;
    }

    if (state.aiThinking) { 
        status.textContent = translations[currentLang].npcTargeting; status.style.color = '#ef4444'; 
    } else { 
        status.textContent = state.turn === 'blue' ? translations[currentLang].turnYour : (state.mode === 'pvp' ? translations[currentLang].turnP2 : translations[currentLang].turnNpc); 
        status.style.color = 'var(--accent-lime)'; 
    }

    p1.className = state.turn === 'blue' ? 'stat-item turn-active' : 'stat-item';
    p2.className = state.turn === 'red' ? 'stat-item turn-active' : 'stat-item';
}

function selectPiece(r, c) {
    if (state.comboMode || state.gameEnded) return;
    const p = state.board[r][c];
    if (!p || p.type !== state.turn) return;

    if (state.selected && state.selected.r === r && state.selected.c === c) {
        state.selected = null; state.moves = [];
    } else {
        playSound('select');
        state.selected = {r, c};
        state.moves = getValidMoves(r, c, state.board);
    }
    render();
}

function getValidMoves(r, c, currentBoard, forceJump = false) {
    const p = currentBoard[r][c];
    const moves = []; if (!p) return moves;
    const dirs = [[-1,-1], [-1,1], [1,-1], [1,1]];

    if (!p.king) {
        const forward = p.type === 'blue' ? -1 : 1;
        if (!forceJump) {
            [[-1, forward], [1, forward]].forEach(([dc, dr]) => {
                const nr = r + dr, nc = c + dc;
                if (inB(nr, nc) && !currentBoard[nr][nc]) moves.push({r: nr, c: nc, eat: null});
            });
        }
        dirs.forEach(([dc, dr]) => {
            const midR = r+dr, midC = c+dc, endR = r+dr*2, endC = c+dc*2;
            if (inB(endR, endC) && !currentBoard[endR][endC]) {
                const target = currentBoard[midR][midC];
                if (target && target.type !== p.type) moves.push({r: endR, c: endC, eat: {r: midR, c: midC}});
            }
        });
    } else {
        dirs.forEach(([dc, dr]) => {
            let currR = r + dr, currC = c + dc, foundEnemy = null;
            while (inB(currR, currC)) {
                const target = currentBoard[currR][currC];
                if (!foundEnemy) {
                    if (!target) { if (!forceJump) moves.push({r: currR, c: currC, eat: null}); }
                    else if (target.type !== p.type) foundEnemy = {r: currR, c: currC};
                    else break;
                } else {
                    if (!target) moves.push({r: currR, c: currC, eat: foundEnemy});
                    else break;
                }
                currR += dr; currC += dc;
            }
        });
    }
    return moves;
}

function executeMove(move) {
    saveHistorySnapshot(); 
    
    const {r, c} = state.selected;
    const p = state.board[r][c];
    const sideColorClass = p.type === 'blue' ? 'log-blue' : 'log-red';
    const pName = p.type === 'blue' ? 'P1' : (state.mode === 'pvp' ? 'P2' : 'NPC');
    
    appendToLog(`${pName}: ${translations[currentLang].logMove} (${move.r}, ${move.c})`, sideColorClass);

    state.board[move.r][move.c] = p;
    state.board[r][c] = null;

    if (move.eat) {
        const victimSq = document.getElementById(`sq-${move.eat.r}-${move.eat.c}`);
        if (victimSq && victimSq.firstChild) {
            victimSq.firstChild.classList.add('fx-explode');
        }
        boardEl.classList.add('shake-impact');
        setTimeout(() => boardEl.classList.remove('shake-impact'), 200);

        state.board[move.eat.r][move.eat.c] = null;
        playSound('capture');
        appendToLog(`${pName}: ${translations[currentLang].logCapture} (${move.eat.r}, ${move.eat.c})`, sideColorClass);
    } else {
        playSound('move');
    }

    if (((p.type === 'blue' && move.r === 0) || (p.type === 'red' && move.r === 9)) && !p.king) {
        p.king = true;
        playSound('king');
        appendToLog(`${pName}: ${translations[currentLang].logKing}`, 'log-active');
    }

    if (move.eat) {
        const next = getValidMoves(move.r, move.c, state.board, true).filter(m => m.eat);
        if (next.length > 0) {
            state.comboMode = true; state.selected = {r: move.r, c: move.c}; state.moves = next;
            render();
            if (state.mode === 'npc' && state.turn === 'red') setTimeout(() => npcMove(), 400);
            return;
        }
    }

    state.comboMode = false; state.turn = state.turn === 'blue' ? 'red' : 'blue';
    state.selected = null; state.moves = [];
    render();
    
    if (!checkWin() && state.mode === 'npc' && state.turn === 'red') {
        state.aiThinking = true;
        updateUI();
        setTimeout(npcMove, 500);
    }
}

function getAllMoves(currentBoard, playerType) {
    const moves = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (currentBoard[r][c]?.type === playerType) {
                const valid = getValidMoves(r, c, currentBoard);
                valid.forEach(m => moves.push({ from: {r, c}, move: m }));
            }
        }
    }
    return moves;
}

function evaluateBoard(b) {
    let score = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const p = b[r][c];
            if (p) {
                let val = p.king ? 30 : 10;
                if (!p.king) val += (p.type === 'red' ? r : (9 - r)) * 0.5;
                if (c === 0 || c === 9 || r === 0 || r === 9) val += 2.0; 
                if (p.type === 'red') score += val; else score -= val;
            }
        }
    }
    return score;
}

function cloneBoard(b) { return b.map(row => row.map(cell => cell ? { ...cell } : null)); }

function minimax(b, depth, alpha, beta, isMax) {
    if (depth === 0) return evaluateBoard(b);
    const side = isMax ? 'red' : 'blue'; const moves = getAllMoves(b, side);
    if (moves.length === 0) return isMax ? -10000 : 10000;

    if (isMax) {
        let maxEval = -Infinity;
        for (const item of moves) {
            const nextB = cloneBoard(b);
            nextB[item.move.r][item.move.c] = nextB[item.from.r][item.from.c]; nextB[item.from.r][item.from.c] = null;
            if (item.move.eat) nextB[item.move.eat.r][item.move.eat.c] = null;
            if (item.move.r === 9) nextB[item.move.r][item.move.c].king = true;
            let score = minimax(nextB, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, score); alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const item of moves) {
            const nextB = cloneBoard(b);
            nextB[item.move.r][item.move.c] = nextB[item.from.r][item.from.c]; nextB[item.from.r][item.from.c] = null;
            if (item.move.eat) nextB[item.move.eat.r][item.move.eat.c] = null;
            if (item.move.r === 0) nextB[item.move.r][item.move.c].king = true;
            let score = minimax(nextB, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, score); beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function npcMove() {
    if (state.gameEnded) return;
    if (state.comboMode) {
        const next = getValidMoves(state.selected.r, state.selected.c, state.board, true).filter(m => m.eat);
        if (next.length > 0) executeMove(next[Math.floor(Math.random() * next.length)]);
        else { state.comboMode = false; state.turn = 'blue'; render(); }
        return;
    }

    const moves = getAllMoves(state.board, 'red');
    if (moves.length === 0) { state.aiThinking = false; state.turn = 'blue'; render(); return; }

    const jumpsAvailable = moves.filter(m => m.move.eat !== null);
    let activeMovePool = moves;

    if (jumpsAvailable.length > 0 && state.diff !== 'easy') {
        const safeJumps = jumpsAvailable.filter(j => {
            const tempB = cloneBoard(state.board);
            tempB[j.move.r][j.move.c] = tempB[j.from.r][j.from.c]; tempB[j.from.r][j.from.c] = null; tempB[j.move.eat.r][j.move.eat.c] = null;
            const opponentCounterMoves = getAllMoves(tempB, 'blue');
            return !opponentCounterMoves.some(om => om.move.eat && om.move.eat.r === j.move.r && om.move.eat.c === j.move.c);
        });
        activeMovePool = safeJumps.length > 0 ? safeJumps : jumpsAvailable;
    }

    let bestMove = null; let bestScore = -Infinity;
    let searchDepth = state.diff === 'hard' ? 5 : (state.diff === 'medium' ? 3 : 1);

    for (const item of activeMovePool) {
        const simulatedBoard = cloneBoard(state.board);
        simulatedBoard[item.move.r][item.move.c] = simulatedBoard[item.from.r][item.from.c]; simulatedBoard[item.from.r][item.from.c] = null;
        if (item.move.eat) simulatedBoard[item.move.eat.r][item.move.eat.c] = null;
        if (item.move.r === 9) simulatedBoard[item.move.r][item.move.c].king = true;

        let score = minimax(simulatedBoard, searchDepth - 1, -Infinity, Infinity, false);
        if (item.move.eat) score += 50;

        if (score > bestScore || (score === bestScore && Math.random() > 0.5)) { bestScore = score; bestMove = item; }
    }

    state.aiThinking = false;
    if (bestMove) { state.selected = bestMove.from; executeMove(bestMove.move); }
}

function inB(r, c) { return r >= 0 && r < 10 && c >= 0 && c < 10; }

function checkWin() {
    let b=0, r=0; state.board.flat().forEach(p => { if (p?.type === 'blue') b++; else if (p?.type === 'red') r++; });
    if (b === 0 || r === 0) {
        state.gameEnded = true;
        const sign = document.getElementById('endgame-sign');
        const msg = document.getElementById('endgame-msg');
        
        sign.style.display = 'flex';
        
        if (state.mode === 'npc') {
            if (b === 0) {
                msg.textContent = translations[currentLang].textLose;
                msg.className = "endgame-text endgame-lose";
                playSound('gamelose');
            } else {
                msg.textContent = translations[currentLang].textWin;
                msg.className = "endgame-text endgame-win";
                playSound('gamewin');
            }
        } else { 
            if (b === 0) {
                msg.textContent = translations[currentLang].textP2Win;
                msg.className = "endgame-text endgame-win";
            } else {
                msg.textContent = translations[currentLang].textP1Win;
                msg.className = "endgame-text endgame-win";
            }
            playSound('gamewin');
        }
        render();
        return true;
    }
    return false;
}