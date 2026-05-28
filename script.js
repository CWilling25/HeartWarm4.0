// ======================== 初始化当前真实时间 ========================
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();   // 0-11
let scheduleDatabase = {};

// ----------------------------- 通用函数 -----------------------------
const healingQuotes = [
    "无论今天多糟糕，<br>你都已经熬过来了。",
    "你不需要事事完美，<br>闪烁的繁星也各有形状。",
    "外界的声音只是参考，<br>你不喜欢就不要参考。",
    "慢慢来，按自己的节奏走，<br>也是一种了不起的超能力。",
    "你的皮肤和身材只是盛放灵魂的容器，<br>你本身就具有至高无上的美丽。"
];

function refreshQuote() {
    document.getElementById('quote-text').innerHTML = healingQuotes[Math.floor(Math.random() * healingQuotes.length)];
}

function switchPage(pageId) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('page-active'));
    document.getElementById('page-'+pageId).classList.add('page-active');
    document.querySelectorAll('.nav-btn').forEach(el => { 
        el.classList.remove('text-orange-400','font-medium'); 
        el.classList.add('text-gray-400'); 
    });
    const activeNav = document.getElementById('nav-'+pageId);
    if(activeNav) { 
        activeNav.classList.remove('text-gray-400'); 
        activeNav.classList.add('text-orange-400','font-medium'); 
    }
    if(pageId === 'planner') renderCalendar();
}

function publishPost() { 
    const input = document.getElementById('postContent'); 
    if(!input.value.trim()) return; 
    const newHTML = `<div class="bg-white p-4 rounded-xl border border-gray-50 shadow-sm mb-4"><p class="text-gray-600 text-sm leading-relaxed">${escapeHtml(input.value)}</p><p class="text-xs text-gray-400 mt-2 text-right">刚刚 · 你的倾诉</p></div>`; 
    document.getElementById('treeHoleFeed').insertAdjacentHTML('afterbegin', newHTML); 
    input.value=''; 
}

function escapeHtml(str) { 
    return str.replace(/[&<>]/g, function(m){
        if(m === '&') return '&amp;'; 
        if(m === '<') return '&lt;'; 
        if(m === '>') return '&gt;'; 
        return m;
    }); 
}

function renderCalendar() { 
    const monthYearEl = document.getElementById('calendar-month-year'); 
    const gridEl = document.getElementById('calendar-grid'); 
    gridEl.innerHTML = ''; 
    monthYearEl.innerText = `${currentYear}年 ${currentMonth+1}月`; 
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); 
    const totalDays = new Date(currentYear, currentMonth+1, 0).getDate(); 
    for(let i=0;i<firstDayIndex;i++) gridEl.insertAdjacentHTML('beforeend', `<div></div>`); 
    for(let day=1;day<=totalDays;day++){ 
        const dateString = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; 
        const hasTaskClass = scheduleDatabase[dateString] ? 'has-task bg-orange-50/60 font-semibold' : 'text-gray-600'; 
        const dayOfWeek = new Date(currentYear, currentMonth, day).getDay(); 
        const isWeekend = (dayOfWeek===0||dayOfWeek===6) ? 'bg-gray-100/40 text-gray-400' : ''; 
        gridEl.insertAdjacentHTML('beforeend', `<div onclick="showDateTasks('${dateString}')" class="calendar-day hover:bg-orange-100 ${hasTaskClass} ${isWeekend}">${day}</div>`); 
    } 
}

function changeMonth(direction) { 
    currentMonth += direction; 
    if(currentMonth>11){ currentMonth=0; currentYear++; } 
    if(currentMonth<0){ currentMonth=11; currentYear--; } 
    renderCalendar(); 
}

function showDateTasks(dateStr) { 
    document.getElementById('selected-date-title').innerText = `📅 日程详情 (${dateStr})`; 
    const listEl = document.getElementById('daily-task-list'); 
    listEl.innerHTML = ''; 
    if(scheduleDatabase[dateStr] && scheduleDatabase[dateStr].length>0) { 
        scheduleDatabase[dateStr].forEach(task => { 
            listEl.insertAdjacentHTML('beforeend', `<div class="flex items-center gap-3 bg-stone-50 p-2 rounded-xl"><span class="bg-orange-400 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">${task.time}</span><span class="text-gray-700 font-medium">${task.text}</span></div>`); 
        }); 
    } else { 
        const dayOfWeek = new Date(dateStr).getDay(); 
        if(dayOfWeek===0||dayOfWeek===6) listEl.innerHTML = `<p class="italic text-green-500 font-medium text-center py-4">☕ 周末放松日：无拘无束休息时间</p>`; 
        else listEl.innerHTML = `<p class="italic text-gray-400 text-center py-4">今天还没有排定任务哦。</p>`; 
    } 
}

function clearAllSchedules() { 
    scheduleDatabase = {}; 
    renderCalendar(); 
    showDateTasks(`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-01`); 
    showModal("所有日程已清空", "🗑️");
}

// 动态生成示例：从明天开始一个月
function loadSampleCase() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    const startStr = `${startDate.getMonth()+1}/${startDate.getDate()}`;
    const endStr = `${endDate.getMonth()+1}/${endDate.getDate()}`;
    document.getElementById('plannerInput').value = `${startStr}到${endStr}备战四级，需要刷完10套卷子加看6小时网课。周六日休息，帮我合理分配到每天，设置具体时间（如9-10点干嘛）并加入日历。`;
}

function toggleVoiceMock() { 
    const status = document.getElementById('voice-status'); 
    const vBtn = document.getElementById('voice-btn'); 
    if(status.classList.contains('hidden')) { 
        status.classList.remove('hidden'); 
        vBtn.classList.add('bg-rose-200','scale-105'); 
        setTimeout(() => { loadSampleCase(); status.classList.add('hidden'); vBtn.classList.remove('bg-rose-200','scale-105'); }, 2000); 
    } 
}

const scenarioFeedbacks = { 
    'A': { style:'bg-rose-50 border border-rose-100 text-rose-700', text:'❌ 长期妥协不会换来尊重，反而消耗自我。尝试区分“他的课题，不是我的责任”。' },
    'B':{ style:'bg-amber-50 border border-amber-100 text-amber-700', text:'⚠️ 拒绝成功但攻击性容易破坏关系，可以更优雅地保护边界。' },
    'C':{ style:'bg-green-50 border border-green-100 text-green-700', text:'🎉 完美示范！温和而坚定，既守护边界又维持得体。' } 
};

function playScenario(choice) { 
    const fb = document.getElementById('sim-feedback'); 
    fb.className = `mt-4 p-3 rounded-xl text-xs leading-relaxed ${scenarioFeedbacks[choice].style}`; 
    fb.innerHTML = scenarioFeedbacks[choice].text; 
    fb.classList.remove('hidden'); 
}

const anxietyData = { 
    skin:"✨ 皮肤的纹理是生命的自然勋章，健康和舒展的生命力更动人。",
    weight:"❤️ 数字定义不了美丽，有力气拥抱世界就是最棒的身材。",
    height:"🌟 你站立的高度，永远无法阻挡灵魂所能触及的辽阔。",
    features:"🎨 你的五官是独一无二的艺术，不必迎合千篇一律的标准。" 
};

function relieveAnxiety(type) { 
    const mirror = document.getElementById('anxiety-mirror'); 
    mirror.className = "bg-orange-50/60 border border-orange-200/60 rounded-xl p-3 min-h-[60px] flex items-center justify-center text-center text-xs text-orange-800 leading-relaxed"; 
    mirror.innerHTML = anxietyData[type]; 
}

// ========================= AI 核心配置 =========================
const SILICON_API_KEY = "sk-kgrbiyvjiosaeafigqmdudravnxlmtfwlqyrjrqbwmeftpiq";
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const AI_MODEL = "THUDM/GLM-4-9B-0414";

// 简单的 Markdown 解析器（支持粗体、斜体、去除行首空格）
function formatMarkdown(text) {
    // 去掉每行开头的连续空格（包括多个空格或制表符）
    let lines = text.split('\n');
    lines = lines.map(line => line.replace(/^\s+/, ''));
    text = lines.join('\n');
    
    // 先转义 HTML 特殊字符，防止注入
    text = text.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
    // 粗体 **text** -> <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 斜体 *text* （避免与粗体冲突，只匹配单个星号包围的内容）
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // 换行转 <br>
    text = text.replace(/\n/g, '<br>');
    return text;
}

async function callAI(messages) {
    const payload = {
        model: AI_MODEL,
        messages: messages,
        temperature: 0.6,
        max_tokens: 2000,
        top_p: 0.9
    };
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${SILICON_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI未返回内容");
    return content;
}

// ========================= AI 智能日程规划 =========================
async function aiPlanSchedule(userRequest) {
    const statusDiv = document.getElementById('planning-status');
    statusDiv.classList.remove('hidden');
    const planBtn = document.getElementById('aiPlanBtn');
    planBtn.disabled = true;
    planBtn.innerText = "⏳ 规划中...";
    
    try {
        const todayDate = new Date();
        const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;
        const systemPrompt = `你是一个专业的时间管理AI。当前真实日期是 ${todayStr}。根据用户的需求，生成详细的日程安排。请严格输出JSON格式，不要包含任何其他解释。
规则：
1. 日程需要覆盖用户指定的日期范围（起始~结束）。如果用户说“明天”、“下个月”等相对时间，请基于当前日期 ${todayStr} 计算具体日期。
2. 如果用户说“周末休息”或类似，则周六周日不安排任务。
3. 每天的任务以数组形式给出，每个任务包含 time (如 "09:00-10:00") 和 text (描述)。
4. 输出格式示例：
{
  "2026-05-15": [{"time": "09:00-10:00", "text": "背单词50个"}, {"time": "14:00-16:00", "text": "做真题卷1"}],
  "2026-05-16": [...]
}
5. 确保日期字符串为 YYYY-MM-DD。
6. 任务数量合理，总工作量需匹配用户要求。
7. 只输出JSON，不要有任何额外文字。`;
        
        const userMsg = `请规划：${userRequest}`;
        const aiResponse = await callAI([
            { role: "system", content: systemPrompt },
            { role: "user", content: userMsg }
        ]);
        
        let jsonStr = aiResponse.trim();
        const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) jsonStr = jsonMatch[1];
        const parsed = JSON.parse(jsonStr);
        
        for (const [date, tasks] of Object.entries(parsed)) {
            if (Array.isArray(tasks) && tasks.length) {
                scheduleDatabase[date] = tasks;
            }
        }
        renderCalendar();
        const firstDate = Object.keys(parsed)[0];
        if (firstDate) showDateTasks(firstDate);
        showModal("AI日程规划已完成！\n点击日历上带橙色点的日期查看详细任务。", "📅");
    } catch (err) {
        console.error("AI规划失败:", err);
        alert("AI规划失败：" + err.message + "\n请尝试更清晰的描述，或使用示例模板。");
    } finally {
        statusDiv.classList.add('hidden');
        planBtn.disabled = false;
        planBtn.innerText = "🤖 AI智能规划";
    }
}

function handleAIPlanning() {
    const input = document.getElementById('plannerInput').value.trim();
    if (!input) {
        showModal("请描述你的日程需求～\n例如：从明天起一个月备战四级，刷10套卷子+6小时网课，周末休息", "📝");
        return;
    }
    aiPlanSchedule(input);
}

document.getElementById('aiPlanBtn').onclick = handleAIPlanning;

// ----------------------------- AI 解忧助手 -----------------------------
let chatHistory = [];
let isWaitingReply = false;
const SYSTEM_PROMPT = {
    role: "system",
    content: `你是一个温柔且专业的心理支持AI，名叫“解忧助手”。你的使命是提供情绪价值、认知重构和具体的行动建议。回答应当简洁、真诚、有力。擅长针对拖延症、焦虑、人际边界、自我悦纳等问题给出富有共情又落地的回应。如果用户提到拖延，请引导进行微观行为启动（最小动作原则）。始终传递“高韧性思维”。语气温暖，但避免过度鸡汤。`
};

function initChatAI() {
    if (chatHistory.length === 0) {
        chatHistory.push(SYSTEM_PROMPT);
        chatHistory.push({ role: "assistant", content: "嗨，我是你的AI心灵伙伴✨ 无论你在焦虑、拖延或孤独，我都会认真倾听并陪你找到突破口。\n试试和我聊聊：“最近总是拖延论文怎么办？” 或 “人际关系好累”～" });
    }
    document.getElementById('sendChatBtn').onclick = () => sendUserMessage();
    document.getElementById('chatInput').onkeypress = (e) => { if (e.key === 'Enter') sendUserMessage(); };
}

function appendMessageToUI(role, content) {
    const chatBox = document.getElementById('chatBox');
    const isUser = role === 'user';
    if (isUser) {
        const userDiv = document.createElement('div');
        userDiv.className = "flex items-start gap-3 justify-end mt-4";
        // 用户消息不需要 Markdown 解析，只需转义换行
        userDiv.innerHTML = `<div class="bg-orange-400 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white max-w-[80%] break-words">${escapeHtml(content).replace(/\n/g, '<br>')}</div>`;
        chatBox.appendChild(userDiv);
    } else {
        const assistantDiv = document.createElement('div');
        assistantDiv.className = "flex items-start gap-3 mt-4";
        // AI 消息进行 Markdown 格式化（包括去除前导空格）
        const formattedContent = formatMarkdown(content);
        assistantDiv.innerHTML = `<div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-lg shrink-0">🤖</div><div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-600 max-w-[80%] leading-relaxed break-words">${formattedContent}</div>`;
        chatBox.appendChild(assistantDiv);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

let typingIndicatorDiv = null;
function showTyping() { 
    if (typingIndicatorDiv) typingIndicatorDiv.remove(); 
    const chatBox = document.getElementById('chatBox'); 
    typingIndicatorDiv = document.createElement('div'); 
    typingIndicatorDiv.className = "flex items-start gap-3 mt-4"; 
    typingIndicatorDiv.innerHTML = `<div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-lg shrink-0">🤖</div><div class="ai-message-loading"><div class="typing-indicator flex gap-1"><span></span><span></span><span></span></div><span class="text-xs text-gray-500 ml-1">AI思考中</span></div>`; 
    chatBox.appendChild(typingIndicatorDiv); 
    chatBox.scrollTop = chatBox.scrollHeight; 
}

function hideTyping() { 
    if (typingIndicatorDiv) { 
        typingIndicatorDiv.remove(); 
        typingIndicatorDiv = null; 
    } 
}

async function sendUserMessage() {
    if (isWaitingReply) { alert("请等待回复~"); return; }
    const inputEl = document.getElementById('chatInput');
    const userText = inputEl.value.trim();
    if (!userText) return;
    appendMessageToUI('user', userText);
    chatHistory.push({ role: "user", content: userText });
    inputEl.value = '';
    isWaitingReply = true;
    showTyping();
    let messagesToSend = [chatHistory[0]];
    let context = chatHistory.slice(1);
    if (context.length > 12) context = context.slice(-12);
    messagesToSend.push(...context);
    try {
        const reply = await callAI(messagesToSend);
        hideTyping();
        appendMessageToUI('assistant', reply.trim());
        chatHistory.push({ role: "assistant", content: reply.trim() });
        if (chatHistory.length > 25) chatHistory = [chatHistory[0], ...chatHistory.slice(-20)];
    } catch (err) {
        hideTyping();
        appendMessageToUI('assistant', "🙁 抱歉，AI服务暂时不可用，请稍后再试。");
    } finally { isWaitingReply = false; }
}

// ======================== 新增：情绪详情页功能 ========================
function showEmotionDetail(emotion) {
    const contentDiv = document.getElementById('emotion-content');
    let title = '';
    let suggestions = '';
    let actions = '';
    
    switch(emotion) {
        case 'happy':
            title = '😊 开心的小太阳';
            suggestions = '你现在的开心就像阳光一样温暖～ 试试这些小事让快乐延续更久：';
            actions = `
                <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700 mt-2">
                    <li>🎁 奖励自己一块小蛋糕或喜欢的零食</li>
                    <li>📸 拍一张照片记录此刻的心情</li>
                    <li>💬 把这份快乐分享给一个重要的人</li>
                    <li>🎵 听一首欢快的歌，跟着扭动身体</li>
                    <li>🌟 写下今天最让你开心的三个细节</li>
                </ul>
                <div class="mt-4 p-3 bg-orange-50 rounded-xl text-xs text-orange-800">
                    记住这个感觉，它是你内心的能量源。
                </div>
            `;
            break;
        case 'calm':
            title = '😌 宁静的湖泊';
            suggestions = '你此刻的平静是一种珍贵的内在力量。可以这样做来加深它：';
            actions = `
                <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700 mt-2">
                    <li>🧘 闭上眼睛，深呼吸5次，感受气息流动</li>
                    <li>🍵 泡一杯温热的茶，慢慢品味</li>
                    <li>📖 读几页喜欢的书，不追求速度</li>
                    <li>🌿 走到窗边，看看远处的绿色或天空</li>
                    <li>🕯️ 点一支香薰蜡烛，享受独处时光</li>
                </ul>
                <div class="mt-4 p-3 bg-orange-50 rounded-xl text-xs text-orange-800">
                    平静是你的盾牌，保护好它。
                </div>
            `;
            break;
        case 'anxious':
            title = '😰 焦虑的微风';
            suggestions = '焦虑是大脑在试图保护你。先试试这个“5-4-3-2-1”急救法：';
            actions = `
                <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700 mt-2">
                    <li>👀 说出你看到的 <strong>5</strong> 样东西</li>
                    <li>✋ 触摸你身边的 <strong>4</strong> 样物体（感受材质）</li>
                    <li>👂 仔细听你听到的 <strong>3</strong> 种声音</li>
                    <li>👃 闻到你周围的 <strong>2</strong> 种气味</li>
                    <li>👅 感受你嘴里 <strong>1</strong> 种味道（或喝一口水）</li>
                </ul>
                <div class="mt-4 p-3 bg-orange-50 rounded-xl text-xs text-orange-800">
                    焦虑会过去，而你一直在这里。如果愿意，可以去「AI解忧」和我聊聊。
                </div>
            `;
            break;
        case 'low':
            title = '🌧️ 低落的云朵';
            suggestions = '允许自己难过，这本身就是一种勇敢。试试这些温柔的自我照顾：';
            actions = `
                <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700 mt-2">
                    <li>🛋️ 给自己一个“什么都不做”的15分钟</li>
                    <li>📝 写下此刻的感受，不用修饰，写完就撕掉</li>
                    <li>🧣 裹紧被子或穿一件柔软的衣服</li>
                    <li>🎬 看一段治愈的短片（比如《小王子》或动物视频）</li>
                    <li>🍲 吃一顿温暖的、不用自己做的饭（点外卖也行）</li>
                </ul>
                <div class="mt-4 p-3 bg-orange-50 rounded-xl text-xs text-orange-800">
                    低落不是你的错，它只是路过。我会在这里一直陪着你。
                </div>
            `;
            break;
        case 'crash':
            title = '🤯 崩溃的边缘';
            suggestions = '你太累了，已经撑了很久。现在最重要的是“停下来”：';
            actions = `
                <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700 mt-2">
                    <li>💨 <strong>立刻停止所有正在做的事</strong>（天不会塌）</li>
                    <li>💧 用冷水洗一把脸，或者冰敷后颈</li>
                    <li>🫂 找一个可以拥抱的人或物体（抱枕/毛绒玩具）</li>
                    <li>🚶 如果有力气，出门走5分钟，只看脚下不看远方</li>
                    <li>📞 拨打心理援助热线（如北京24小时：010-82951332）</li>
                </ul>
                <div class="mt-4 p-3 bg-orange-50 rounded-xl text-xs text-orange-800">
                    你不是一个人。崩溃是身体在喊停，请一定善待此刻的自己。
                </div>
            `;
            break;
        default: return;
    }
    
    contentDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-orange-600 mb-4">${title}</h2>
        <p class="text-gray-600 text-base leading-relaxed mb-4">${suggestions}</p>
        ${actions}
        <div class="mt-6 pt-4 border-t border-gray-100 text-center">
            <button onclick="switchPage('home')" class="bg-orange-400 text-white px-5 py-2 rounded-full text-sm shadow-md active:scale-95">
                回到首页 ❤️
            </button>
        </div>
    `;
    
    // 切换到情绪详情页
    switchPage('emotion-detail');
}

// ======================== 自定义模态框 ========================
function showModal(message, icon = '✅') {
    const modal = document.getElementById('customModal');
    const msgEl = document.getElementById('modalMessage');
    const iconEl = document.getElementById('modalIcon');
    if (!modal) return;
    
    msgEl.innerText = message;
    iconEl.innerText = icon;
    
    modal.classList.remove('hidden');
    // 点击遮罩关闭
    modal.onclick = (e) => {
        if (e.target === modal) hideModal();
    };
    // 点击确认按钮关闭
    document.getElementById('modalConfirmBtn').onclick = hideModal;
}

function hideModal() {
    const modal = document.getElementById('customModal');
    if (modal) modal.classList.add('hidden');
}
// ======================== 泡泡解压小游戏（音效+逼真版） ========================
let popTotal = 0;
let currentBubbleWords = [];
let bubbleElements = [];
let isGenerating = false;

// ---- 音效系统 ----
let soundEnabled = true;
let popAudio = null;
function initAudio() {
    try {
        popAudio = new Audio('pop.mp3');  // 用户需将 pop.mp3 放在同一目录
        popAudio.preload = 'auto';
        // 静音测试（有些浏览器要求用户交互后才能播放，但后续点击时播放是允许的）
        popAudio.load();
    } catch(e) { console.warn("无法加载音频", e); }
}
function playPopSound() {
    if (!soundEnabled) return;
    if (!popAudio) initAudio();
    if (popAudio) {
        // 重新播放（如果已经在播放，克隆一个快速播放）
        const clone = popAudio.cloneNode();
        clone.play().catch(e => console.log("音频播放失败", e));
    }
}
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
        btn.innerHTML = soundEnabled ? '🔊 音效开' : '🔇 音效关';
    }
    localStorage.setItem('bubbleSoundEnabled', soundEnabled);
}

async function fetchHealingPhrase() {
    try {
        const system = "你是一个温暖的心理支持AI。请生成一句治愈、鼓励的话，大约25~35个字，不要太长也不要太短，比如『每一次努力都在让你变得更强大，今天也要好好爱自己』。只输出这句话，不要加任何额外解释。";
        const user = "请给我一句温暖的心灵疗愈短句，稍微长一点，以便拆成多个汉字藏在泡泡下面。";
        const response = await callAI([
            { role: "system", content: system },
            { role: "user", content: user }
        ]);
        let phrase = response.trim();
        // 不再强制截断，保留完整句子
        return phrase;
    } catch (err) {
        console.warn("AI生成失败，使用默认句", err);
        return "愿你开心每一天，世界和我爱着你"; // 默认句子也稍长一点
    }
}

function splitIntoChineseChars(str) {
    const chineseChars = str.match(/[\u4e00-\u9fa5]/g);
    if (!chineseChars) return ["✨"];
    return chineseChars;
}

function createBubbles(count = 20, wordsArray = []) {
    const gameArea = document.getElementById('bubbleGameArea');
    if (!gameArea) return;
    gameArea.innerHTML = '';
    bubbleElements = [];
    currentBubbleWords = [];

    // 按顺序分配汉字，允许随机跳过（留空）
    let wordIndex = 0;
    const totalWords = wordsArray.length;

    for (let i = 0; i < count; i++) {
        let assignedWord = '';
        // 如果还有未分配的汉字
        if (wordIndex < totalWords) {
            // 剩余泡泡数
            const remainingBubbles = count - i;
            const remainingWords = totalWords - wordIndex;
            // 如果剩余字数和剩余泡泡数相等，则必须连续放置（避免最后没放完）
            // 否则，有 65% 的概率放置下一个字，35% 概率跳过（留空）
            const shouldPlace = (remainingWords === remainingBubbles) || Math.random() < 0.65;
            if (shouldPlace) {
                assignedWord = wordsArray[wordIndex];
                wordIndex++;
            }
        }
        currentBubbleWords.push(assignedWord);

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const rot = (Math.random() * 10 - 5).toFixed(1);
        bubble.style.setProperty('--rot', rot + 'deg');
        bubble.style.margin = '6px';
        const hue = 32 + Math.random() * 12;
        bubble.style.background = `radial-gradient(circle at 35% 30%, rgba(255,255,245,0.95), hsl(${hue}, 85%, 65%))`;
        bubble.innerHTML = '✨';

        bubble.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bubble.classList.contains('bubble-popped')) return;
            playPopSound();
            bubble.classList.add('bubble-popped');
            const hiddenWord = currentBubbleWords[bubbleElements.indexOf(bubble)];
            if (hiddenWord && hiddenWord !== '') {
                bubble.innerHTML = hiddenWord;
                bubble.style.fontSize = '32px';
                bubble.style.fontWeight = 'bold';
                bubble.style.color = '#9b4a1a';
            } else {
                bubble.innerHTML = '💨';
                bubble.style.fontSize = '28px';
            }
            popTotal++;
            const counterEl = document.getElementById('popCounter');
            if (counterEl) counterEl.innerText = `💥 已戳破 ${popTotal} 个`;
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);
        });
        gameArea.appendChild(bubble);
        bubbleElements.push(bubble);
    }
}

async function resetBubbleGame() {
    if (isGenerating) {
        alert("正在生成新的疗愈话语，请稍后～");
        return;
    }
    isGenerating = true;
    const resetBtn = document.getElementById('resetBubblesBtn');
    const originalText = resetBtn.innerText;
    resetBtn.innerText = "✨ 生成祝福中...";
    resetBtn.disabled = true;

    const gameArea = document.getElementById('bubbleGameArea');
    if (gameArea) gameArea.innerHTML = '<div class="text-center text-gray-400 text-sm py-10">🌟 向星星许愿，为你准备治愈文字...</div>';

    try {
        const phrase = await fetchHealingPhrase();
        const charsArray = splitIntoChineseChars(phrase);
        const bubbleCount = window.innerWidth < 500 ? 16 : 20;
        createBubbles(bubbleCount, charsArray);
        popTotal = 0;
        const counterEl = document.getElementById('popCounter');
        if (counterEl) counterEl.innerText = `💥 已戳破 0 个`;
    } catch (err) {
        console.error(err);
        if (gameArea) gameArea.innerHTML = '<div class="text-center text-red-400 text-sm">抱歉，祝福生成失败，点一下新的一板重试～</div>';
    } finally {
        resetBtn.innerText = originalText;
        resetBtn.disabled = false;
        isGenerating = false;
    }
}

async function initBubbleGame() {
    const gameArea = document.getElementById('bubbleGameArea');
    if (!gameArea) return;

    // 读取音效设置
    const saved = localStorage.getItem('bubbleSoundEnabled');
    if (saved !== null) soundEnabled = saved === 'true';
    const toggleBtn = document.getElementById('soundToggleBtn');
    if (toggleBtn) {
        toggleBtn.innerHTML = soundEnabled ? '🔊 音效开' : '🔇 音效关';
        toggleBtn.onclick = () => toggleSound();
    }
    // 预加载音频
    initAudio();

    const resetBtn = document.getElementById('resetBubblesBtn');
    if (resetBtn) {
        resetBtn.removeEventListener('click', resetBubbleGame);
        resetBtn.addEventListener('click', resetBubbleGame);
    }
    await resetBubbleGame();
}
// 修改原来的 DOMContentLoaded，加入游戏初始化
// 注意：不要覆盖原有监听器，而是在原有监听器末尾增加调用
// 建议找到 window.addEventListener('DOMContentLoaded', ...) 那一段，在里面加上 initBubbleGame();
// 页面初始化
window.addEventListener('DOMContentLoaded', () => {
    initChatAI();
    refreshQuote();
    renderCalendar();
    const todayStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    showDateTasks(todayStr);
    initBubbleGame();   // ← 添加这一行，泡泡就会出现了
});

// ======================== 漂流瓶功能（JSONBin.io 直连） ========================
const JSONBIN_MASTER_KEY = '$2a$10$n2JYoTPS/OkEg8FAOWSfqufl3LVuufvnCteODsqwfvFehkbfV31TG';  // 例如 $2a$10$...
const JSONBIN_BIN_ID = '6a17e50d21f9ee59d294212f';         // 例如 1234567890
const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// 辅助函数：读取当前所有漂流瓶
async function fetchAllBottles() {
    const res = await fetch(JSONBIN_API_URL + '/latest', {
        headers: { 'X-Master-Key': JSONBIN_MASTER_KEY }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.record.bottles || [];   // record 里存的是我们自己的 JSON 对象
}

// 辅助函数：保存漂流瓶列表
async function saveAllBottles(bottlesArray) {
    // 限制最多 100 条，超出删除最旧的
    if (bottlesArray.length > 100) {
        bottlesArray = bottlesArray.slice(-100);
    }
    const payload = { bottles: bottlesArray };
    const res = await fetch(JSONBIN_API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_MASTER_KEY
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
}

// AI 内容审核（复用你已有的 callAI）
async function moderateBottleContent(text) {
    const systemPrompt = `你是一个内容安全审查助手。判断以下消息是否适合在公共平台展示。
输出严格的JSON格式：{"isSafe": true/false, "reason": "不安全的原因"}
规则：
1. 禁止粗俗、辱骂、色情、暴力内容
2. 禁止政治敏感、人身攻击
3. 鼓励暖心、积极、治愈的内容
只输出JSON，不要有其他解释。`;

    try {
        const response = await callAI([
            { role: "system", content: systemPrompt },
            { role: "user", content: `请审查：${text}` }
        ]);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { isSafe: true, reason: "" };
    } catch (err) {
        console.error("AI审核失败", err);
        return { isSafe: true, reason: "AI服务暂时不可用" };
    }
}

// 发送漂流瓶
async function sendBottle(content) {
    const moderation = await moderateBottleContent(content);
    if (!moderation.isSafe) {
        showModal(`内容不合适：${moderation.reason}\n请修改后重试。`, "⚠️");
        return false;
    }
    try {
        const bottles = await fetchAllBottles();
        bottles.push({
            id: Date.now(),
            text: content,
            author: '匿名',
            timestamp: new Date().toISOString()
        });
        await saveAllBottles(bottles);
        showModal("你的漂流瓶已投入大海～🌊", "🍾");
        return true;
    } catch (err) {
        console.error("保存失败", err);
        showModal("发送失败，请稍后重试", "❌");
        return false;
    }
}

// 随机捞取漂流瓶
async function fetchRandomBottle() {
    try {
        const bottles = await fetchAllBottles();
        if (!bottles.length) {
            return { success: false, message: "大海里还没有漂流瓶，去投放第一个吧～" };
        }
        const randomIndex = Math.floor(Math.random() * bottles.length);
        const bottle = bottles[randomIndex];
        return { success: true, bottle };
    } catch (err) {
        console.error("读取失败", err);
        return { success: false, message: "捞取失败，请稍后再试" };
    }
}

// UI 初始化函数（你原来写好的，不需要改动，但确保 sendBottle / fetchRandomBottle 名称对上）
// 注意：你原来的 initBottleUI 函数里已经调用了 sendBottle 和 fetchRandomBottle，所以不用改。
// 只需把上面的函数替换掉旧的即可。

// ---------- 6. UI 绑定与初始化 ----------
function initBottleUI() {
  const sendBtn = document.getElementById('sendBottleBtn');
  const fetchBtn = document.getElementById('fetchBottleBtn');
  const tabSend = document.getElementById('tab-send');
  const tabReceive = document.getElementById('tab-receive');
  const sendMode = document.getElementById('send-mode');
  const receiveMode = document.getElementById('receive-mode');
  const messageInput = document.getElementById('bottleMessage');
  const charCountSpan = document.getElementById('charCount');

  // 字数统计
  if (messageInput && charCountSpan) {
    messageInput.addEventListener('input', () => {
      charCountSpan.innerText = messageInput.value.length;
    });
  }

  // 发送按钮
  if (sendBtn) {
    sendBtn.onclick = async () => {
      const content = messageInput?.value.trim();
      if (!content) {
        showModal("请写一些暖心的话再投出～", "📝");
        return;
      }
      if (content.length > 200) {
        showModal("内容不能超过200字", "⚠️");
        return;
      }
      sendBtn.disabled = true;
      sendBtn.innerText = "⏳ AI审核中...";
      await sendBottle(content);
      if (messageInput) messageInput.value = '';
      if (charCountSpan) charCountSpan.innerText = '0';
      sendBtn.disabled = false;
      sendBtn.innerText = "📤 漂流至大海";
    };
  }

  // 捞取按钮
  if (fetchBtn) {
    fetchBtn.onclick = async () => {
      fetchBtn.disabled = true;
      fetchBtn.innerText = "⏳ 捞取中...";
      const result = await fetchRandomBottle();
      const displayDiv = document.getElementById('randomMessageDisplay');
      if (displayDiv) {
        if (result.success) {
          const bottle = result.bottle;
          const date = new Date(bottle.timestamp).toLocaleDateString();
          displayDiv.innerHTML = `
            <div class="bg-orange-50 p-5 rounded-2xl shadow-sm w-full text-left">
              <div class="text-3xl mb-2 text-center">🍾</div>
              <p class="text-gray-700 text-base leading-relaxed mb-3">“${escapeHtml(bottle.text)}”</p>
              <p class="text-right text-xs text-gray-400">来自 ${bottle.author} · ${date}</p>
            </div>
          `;
        } else {
          displayDiv.innerHTML = `
            <div class="text-center">
              <div class="text-4xl mb-3 opacity-40">🌊</div>
              <p class="text-gray-500">${result.message}</p>
            </div>
          `;
        }
      }
      fetchBtn.disabled = false;
      fetchBtn.innerText = "🌊 捞一个漂流瓶";
    };
  }

  // Tab 切换
  if (tabSend && tabReceive && sendMode && receiveMode) {
    tabSend.onclick = () => {
      sendMode.classList.remove('hidden');
      receiveMode.classList.add('hidden');
      tabSend.classList.add('bg-white', 'shadow-sm', 'text-orange-500');
      tabSend.classList.remove('text-gray-500');
      tabReceive.classList.remove('bg-white', 'shadow-sm', 'text-orange-500');
      tabReceive.classList.add('text-gray-500');
    };
    tabReceive.onclick = () => {
      receiveMode.classList.remove('hidden');
      sendMode.classList.add('hidden');
      tabReceive.classList.add('bg-white', 'shadow-sm', 'text-orange-500');
      tabReceive.classList.remove('text-gray-500');
      tabSend.classList.remove('bg-white', 'shadow-sm', 'text-orange-500');
      tabSend.classList.add('text-gray-500');
    };
  }
}

// ---------- 7. 在页面加载完成后初始化漂流瓶 ----------
// 注意：原来可能已经有 DOMContentLoaded 监听器，请合并，不要覆盖。
// 如果你的代码中已经有 window.addEventListener('DOMContentLoaded', ...)，请把下面这一行里面的 initBottleUI 加到那个监听器里。
// 如果还没有，可以直接用下面的代码。
if (typeof window !== 'undefined') {
  // 确保 DOM 加载完成后再执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBottleUI();
    });
  } else {
    initBottleUI();
  }
}