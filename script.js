// === i18n Translations ===
const translations = {
  en: {
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.greeting': "Hi, I'm",
    'hero.title': 'Economics & AI Strategy',
    'hero.desc': "Master's student at <strong>CUHK & Northwestern University</strong>. Trained in economics to think rationally, deeply passionate about AI as the direction I want to grow in. Exploring how AI reshapes industries and building tools that matter.",
    'about.title': 'About Me',
    'about.education': 'Education',
    'about.edu.content': '<p><strong>CUHK & Northwestern University</strong><br>M.S. in Applied Economics & Quantitative Econometrics<br>GPA: 4.0/4.0 | Scholarship Recipient</p><p><strong>CUHK-Shenzhen</strong><br>B.A. in Economics | Top 1% Gaokao<br>Dean\'s List \u00d7 3 | First Class Honors</p><p><strong>Copenhagen Business School</strong><br>Exchange Student</p>',
    'about.whatido': 'What I Do',
    'about.whatido.content': '<p>Economics trained how I think \u2014 identifying key variables and making decisions under uncertainty. AI is how I amplify that ability.</p><p>Currently interning in AI technology strategy at <strong>Xiaohongshu (REDnote)</strong>. I read arXiv papers and track GitHub repos daily, and I build my own tools from scratch. I believe good judgment is built on truly understanding the technology \u2014 I don\'t make calls on things I haven\'t dug into myself.</p>',
    'about.techstack': 'Tech Stack',
    'about.beyond': 'Beyond Work',
    'about.beyond.content': '\ud83d\udcf7 Photography enthusiast<br>\ud83c\udf0d Traveled 15+ countries<br>\ud83c\udfae Mobile & console gamer<br>\ud83d\udde3\ufe0f Fluent in English & Chinese<br><span class="subtle">GRE 326+4.5 | TOEFL 109</span>',
    'exp.title': 'Experience',
    'exp.present': 'Present',
    'exp.xhs.role': 'AI Technology Strategy Intern',
    'exp.xhs.company': 'Xiaohongshu (REDnote) \u00b7 Shanghai',
    'exp.xhs.items': '<li>Deep-dive research on AI Coding, embodied intelligence, and OpenClaw \u2014 reports endorsed by senior tech executives</li><li>Built <strong>Frontier Insight Bot</strong> with Claude Code: automated intelligence pipeline covering 250+ global AI sources, delivering daily briefs & weekly strategic reports</li><li>Led internal AI workshops on Vibe Coding; packaged workflows into Skills with 100+ downloads on company platform</li><li>Authored 10+ strategic business reports driving decisions across security, risk control, and operational efficiency</li>',
    'exp.ipsos.role': 'Social Media User Research Intern',
    'exp.ipsos.company': 'Ipsos China \u00b7 Shanghai',
    'exp.ipsos.items': '<li>Built multi-source social media keyword systems & corpus databases using AI-assisted pipelines</li><li>Developed rule-based models for sentiment analysis and multi-dimensional topic tracking</li><li>Produced regular reports on topic trends and sentiment analysis for FMCG & e-commerce clients</li>',
    'exp.guohai.role': 'Industry Analyst \u2014 Overseas Internet Team',
    'exp.guohai.company': 'Guohai Securities \u00b7 Top 3 National Team',
    'exp.guohai.items': '<li>Conducted deep research on AIGC, gaming, and e-commerce sectors</li><li>Processed 100K+ data points tracking DAU, app downloads, and website PV across platforms</li><li>Authored a 58-page report on Unity\'s product matrix and business model</li><li>Built valuation models using DCF, PE/PS comparable analysis</li>',
    'exp.minsheng.role': 'Investment Banking Intern',
    'exp.minsheng.company': 'Minsheng Securities',
    'exp.minsheng.items': '<li>Supported 2 IPO projects with due diligence, background checks, and financial verification</li><li>Conducted 15+ client interviews in English with overseas suppliers</li><li>Drafted industry sections for prospectuses in IVD and pet food sectors</li>',
    'proj.title': 'Projects',
    'proj.featured': 'Featured',
    'proj.afi.desc': 'Automated AI intelligence system covering 250+ global sources. Crawls, filters, summarizes, and distributes daily briefs & weekly strategic reports.',
    'proj.toolkit.desc': 'A collection of Claude Code Skills for end-to-end research automation \u2014 from information gathering to structured output.',
    'proj.toolkit.news': 'Daily News Digest \u2014 automated multi-source news pipeline',
    'proj.toolkit.interview': 'Interview Digest \u2014 podcast & video to structured summary',
    'proj.toolkit.transcript': 'Transcript Writer \u2014 meeting audio to text',
    'proj.toolkit.sizing': 'Market Sizing \u2014 TAM/SAM/SOM with cross-validation',
    'proj.toolkit.research': 'Research Report \u2014 end-to-end deep research workflow',
    'proj.toolkit.more': 'More skills in development...',
    'proj.misinfo.title': 'Social Media Misinformation Detector',
    'proj.misinfo.desc': 'ML model for classifying UGC authenticity on social media. Built with Random Forest, XGBoost, and SVM on 5000+ labeled samples. Achieved 79.8% accuracy. <strong>Best Technology Award.</strong>',
    'proj.viewgithub': 'View on GitHub',
    'proj.afi.arch': 'System Architecture',
    'proj.afi.insights': 'Live Insights',
    'nav.insights': 'Insights',
    'contact.title': 'Get in Touch',
    'contact.desc': "Feel free to reach out \u2014 whether it's about collaboration, opportunities, or just a chat about AI and economics.",
    'hero.resume': 'Resume',
    'footer.text': '\u00a9 2026 Amber Zhou. Built with curiosity and Claude Code.',
    'chat.badge': 'Try my AI assistant!',
    'chat.assistant.name': "Amber's AI Assistant",
    'chat.assistant.subtitle': 'Ask anything about me',
    'chat.welcome': "Hi! \ud83d\udc4b I'm Amber's AI assistant. Ask me anything about her background, experience, projects, or skills \u2014 I'll do my best to answer!",
    'chat.placeholder': 'Type your question...',
    'chat.placeholder.insights': 'Ask about AI trends...',
    'chat.thinking': 'Thinking...',
    'chat.error': "Sorry, I'm having trouble connecting right now. Please try again later or reach out via email!",
    'chat.mode.personal': 'About Me',
    'chat.mode.insights': 'AI Insights',
    'chat.welcome.insights': "Hi! \ud83d\udc4b Ask me about AI trends, daily signals, or weekly deep insights. All answers are based on Amber's self-built intelligence database and her original analysis.",
    'chat.suggest.personal.1': 'What roles would suit Amber?',
    'chat.suggest.personal.2': 'How was this website and chatbot built?',
    'chat.suggest.insights.1': 'What AI trends are most worth watching right now?',
    'chat.suggest.insights.2': 'What are the opportunities for AI agents?'
  },
  zh: {
    'nav.about': '\u5173\u4e8e\u6211',
    'nav.experience': '\u7ecf\u5386',
    'nav.projects': '\u9879\u76ee',
    'nav.contact': '\u8054\u7cfb',
    'hero.greeting': '\u4f60\u597d\uff0c\u6211\u662f',
    'hero.title': '\u7ecf\u6d4e\u5b66 & AI \u6218\u7565',
    'hero.desc': '\u9999\u6e2f\u4e2d\u6587\u5927\u5b66 & \u7f8e\u56fd\u897f\u5317\u5927\u5b66\u7855\u58eb\u5728\u8bfb\u3002\u7ecf\u6d4e\u5b66\u8bad\u7ec3\u4e86\u6211\u7406\u6027\u601d\u8003\u7684\u65b9\u5f0f\uff0cAI \u662f\u6211\u60f3\u6301\u7eed\u6df1\u8015\u7684\u65b9\u5411\u3002\u6301\u7eed\u63a2\u7d22 AI \u5982\u4f55\u91cd\u5851\u884c\u4e1a\uff0c\u6784\u5efa\u771f\u6b63\u6709\u7528\u7684\u5de5\u5177\u3002',
    'about.title': '\u5173\u4e8e\u6211',
    'about.education': '\u6559\u80b2\u80cc\u666f',
    'about.edu.content': '<p><strong>\u9999\u6e2f\u4e2d\u6587\u5927\u5b66 & \u7f8e\u56fd\u897f\u5317\u5927\u5b66</strong><br>\u5e94\u7528\u7ecf\u6d4e\u5b66\u4e0e\u91cf\u5316\u8ba1\u91cf\u53cc\u5b66\u4f4d\u7855\u58eb<br>GPA\uff1a4.0/4.0 | \u5956\u5b66\u91d1\u83b7\u5f97\u8005</p><p><strong>\u9999\u6e2f\u4e2d\u6587\u5927\u5b66\uff08\u6df1\u5733\uff09</strong><br>\u7ecf\u6d4e\u5b66\u5b66\u58eb | \u9ad8\u8003\u524d1%<br>\u9662\u957f\u5609\u8bb8\u5956\u00d73 | \u7532\u7b49\u8363\u8a89\u5b66\u4f4d</p><p><strong>\u4e39\u9ea6\u54e5\u672c\u54c8\u6839\u5546\u5b66\u9662</strong><br>\u4ea4\u6362\u751f</p>',
    'about.whatido': '\u6211\u5728\u505a\u4ec0\u4e48',
    'about.whatido.content': '<p>\u7ecf\u6d4e\u5b66\u8bad\u7ec3\u4e86\u6211\u7684\u5224\u65ad\u529b\u2014\u2014\u5728\u4e0d\u786e\u5b9a\u6027\u4e2d\u8bc6\u522b\u5173\u952e\u53d8\u91cf\u3001\u505a\u51fa\u51b3\u7b56\u3002AI \u662f\u6211\u5c06\u8fd9\u79cd\u80fd\u529b\u653e\u5927\u7684\u65b9\u5f0f\u3002</p><p>\u76ee\u524d\u5728<strong>\u5c0f\u7ea2\u4e66</strong>\u4ece\u4e8b AI \u6280\u672f\u6218\u7565\u65b9\u5411\u7684\u5b9e\u4e60\u3002\u6211\u6bcf\u5929\u9605\u8bfb arXiv \u8bba\u6587\u3001\u8ffd\u8e2a GitHub \u524d\u6cbf\u4ed3\u5e93\uff0c\u4e5f\u81ea\u5df1\u52a8\u624b\u628a\u60f3\u6cd5\u9020\u51fa\u6765\u3002\u6211\u76f8\u4fe1\u597d\u7684\u5224\u65ad\u529b\u5efa\u7acb\u5728\u5bf9\u6280\u672f\u7684\u771f\u6b63\u7406\u89e3\u4e4b\u4e0a\u2014\u2014\u770b\u4e0d\u61c2\u7684\u4e1c\u897f\uff0c\u6211\u4e0d\u4f1a\u5047\u88c5\u80fd\u505a\u51b3\u7b56\u3002</p>',
    'about.techstack': '\u6280\u672f\u6808',
    'about.beyond': '\u5de5\u4f5c\u4e4b\u5916',
    'about.beyond.content': '\ud83d\udcf7 \u6444\u5f71\u7231\u597d\u8005<br>\ud83c\udf0d \u65c5\u5c4515+\u56fd\u5bb6<br>\ud83c\udfae \u624b\u6e38&\u4e3b\u673a\u6e38\u620f\u73a9\u5bb6<br>\ud83d\udde3\ufe0f \u4e2d\u82f1\u53cc\u8bed\u6d41\u5229<br><span class="subtle">GRE 326+4.5 | TOEFL 109</span>',
    'exp.title': '\u7ecf\u5386',
    'exp.present': '\u81f3\u4eca',
    'exp.xhs.role': 'AI \u6280\u672f\u6218\u7565\u5b9e\u4e60\u751f',
    'exp.xhs.company': '\u5c0f\u7ea2\u4e66 \u00b7 \u4e0a\u6d77',
    'exp.xhs.items': '<li>\u805a\u7126 AI Coding\u3001\u5177\u8eab\u667a\u80fd\u3001OpenClaw \u7b49\u524d\u6cbf\u9886\u57df\u6df1\u5ea6\u7814\u7a76\u2014\u2014\u62a5\u544a\u83b7\u591a\u4f4d\u6838\u5fc3\u6280\u672f\u9ad8\u7ba1\u70b9\u8d5e</li><li>\u57fa\u4e8e Claude Code \u72ec\u7acb\u5f00\u53d1 Frontier Insight Bot\uff1a\u8986\u76d6 250+ \u5168\u7403 AI \u4fe1\u6e90\u7684\u81ea\u52a8\u5316\u60c5\u62a5\u7cfb\u7edf\uff0c\u65e5\u63a8\u65e5\u62a5\u3001\u5468\u51fa\u6218\u7565\u5468\u62a5</li><li>\u53d7\u9080\u4e3e\u529e\u5185\u90e8 Vibe Coding Workshop\uff1b\u5c06\u91cd\u590d\u6d41\u7a0b\u5c01\u88c5\u4e3a Skill\uff0c\u4e0a\u67b6\u516c\u53f8 Skill Market\uff0c\u8d85 100 \u6b21\u4e0b\u8f7d</li><li>\u8f93\u51fa 10+ \u4efd\u6218\u7565 BP \u62a5\u544a\uff0c\u843d\u5730\u81f3\u5b89\u5168\u98ce\u63a7\u3001\u5185\u90e8\u6548\u7387\u63d0\u5347\u7b49\u591a\u4e2a\u573a\u666f</li>',
    'exp.ipsos.role': '\u793e\u5a92\u7528\u6237\u7814\u7a76\u5b9e\u4e60\u751f',
    'exp.ipsos.company': '\u76ca\u666e\u7d22\uff08\u4e2d\u56fd\uff09\u00b7 \u4e0a\u6d77',
    'exp.ipsos.items': '<li>\u5229\u7528 AI \u72ec\u7acb\u642d\u5efa\u591a\u6e90\u793e\u5a92\u5173\u952e\u8bcd\u4f53\u7cfb\u4e0e\u9ad8\u8d28\u91cf\u5206\u6790\u8bed\u6599\u5e93</li><li>\u642d\u5efa\u6761\u4ef6\u8bed\u53e5\u4e0e\u89c4\u5219\u6a21\u578b\uff0c\u8fdb\u884c\u60c5\u611f\u6781\u6027\u5224\u5b9a\u4e0e\u591a\u7ef4\u5ea6\u8bdd\u9898\u8ffd\u8e2a</li><li>\u5b9a\u671f\u5b8c\u6210\u8206\u60c5\u5206\u6790\u62a5\u544a\uff0c\u4e3a\u5feb\u6d88\u3001\u7535\u5546\u884c\u4e1a\u5ba2\u6237\u63d0\u4f9b\u53ef\u843d\u5730\u7684\u7b56\u7565\u5efa\u8bae</li>',
    'exp.guohai.role': '\u884c\u4e1a\u5206\u6790\u5e08 \u00b7 \u6d77\u5916\u4e92\u8054\u7f51\u7ec4',
    'exp.guohai.company': '\u56fd\u6d77\u8bc1\u5238 \u00b7 \u5168\u56fd Top3 \u56e2\u961f',
    'exp.guohai.items': '<li>\u6df1\u5165\u7814\u7a76 AIGC\u3001\u6e38\u620f\u3001\u7535\u5546\u7b49\u4e92\u8054\u7f51\u884c\u4e1a\u53d1\u5c55\u8d8b\u52bf</li><li>\u5904\u7406 DAU\u3001APP \u4e0b\u8f7d\u91cf\u7b49\u6570\u636e\u8d85 10 \u4e07\u6761\uff0c\u8ffd\u8e2a\u4ea7\u54c1\u7528\u6237\u6d3b\u8dc3\u5ea6</li><li>\u6df1\u5165\u7814\u7a76 Unity \u4ea7\u54c1\u77e9\u9635\u4e0e\u5546\u4e1a\u6a21\u5f0f\uff0c\u4ea7\u51fa 58 \u9875\u62a5\u544a</li><li>\u8fd0\u7528 DCF\u3001\u53ef\u6bd4\u516c\u53f8\u4f30\u503c\u6cd5\u642d\u5efa\u4f30\u503c\u6a21\u578b</li>',
    'exp.minsheng.role': '\u6295\u8d44\u94f6\u884c\u90e8\u5b9e\u4e60\u751f',
    'exp.minsheng.company': '\u6c11\u751f\u8bc1\u5238',
    'exp.minsheng.items': '<li>\u652f\u6301\u4e24\u4e2a IPO \u9879\u76ee\uff0c\u5b8c\u6210 50+ \u80cc\u8c03\u4e0e\u4e07\u6761\u6d41\u6c34\u6838\u67e5</li><li>\u4e3b\u6301 15+ \u573a\u5168\u82f1\u6587\u6d77\u5916\u4f9b\u5e94\u5546\u4e0e\u5ba2\u6237\u8bbf\u8c08</li><li>\u53c2\u4e0e\u4f53\u5916\u8bca\u65ad\u8bd5\u5242\u548c\u5ba0\u7269\u98df\u54c1\u884c\u4e1a\u7814\u7a76\uff0c\u64b0\u5199\u62db\u80a1\u4e66\u884c\u4e1a\u90e8\u5206</li>',
    'proj.title': '\u9879\u76ee',
    'proj.featured': '\u91cd\u70b9\u9879\u76ee',
    'proj.afi.desc': '\u8986\u76d6 250+ \u5168\u7403 AI \u4fe1\u6e90\u7684\u81ea\u52a8\u5316\u60c5\u62a5\u7cfb\u7edf\u3002\u6bcf\u65e5\u8f93\u51fa\u7cbe\u70bc\u4fe1\u53f7\u65e5\u62a5\uff0c\u6bcf\u5468\u751f\u6210\u6218\u7565\u7ea7\u6df1\u5ea6\u5468\u62a5\u3002',
    'proj.toolkit.desc': '\u57fa\u4e8e Claude Code Skills \u7684\u7aef\u5230\u7aef\u7814\u7a76\u81ea\u52a8\u5316\u5de5\u5177\u96c6\u2014\u2014\u4ece\u4fe1\u606f\u91c7\u96c6\u5230\u7ed3\u6784\u5316\u8f93\u51fa\u3002',
    'proj.toolkit.news': '\u6bcf\u65e5\u65b0\u95fb\u6458\u8981\u2014\u2014\u591a\u6e90\u81ea\u52a8\u5316\u65b0\u95fb\u7ba1\u7ebf',
    'proj.toolkit.interview': '\u8bbf\u8c08\u6458\u8981\u2014\u2014\u64ad\u5ba2/\u89c6\u9891\u8f6c\u7ed3\u6784\u5316\u6458\u8981',
    'proj.toolkit.transcript': '\u4f1a\u8bae\u8f6c\u5f55\u2014\u2014\u5f55\u97f3\u81ea\u52a8\u8f6c\u6587\u5b57',
    'proj.toolkit.sizing': '\u5e02\u573a\u89c4\u6a21\u4f30\u7b97\u2014\u2014TAM/SAM/SOM \u591a\u65b9\u6cd5\u4ea4\u53c9\u9a8c\u8bc1',
    'proj.toolkit.research': '\u6df1\u5ea6\u7814\u7a76\u62a5\u544a\u2014\u2014\u4ece\u9009\u9898\u5230\u6210\u7a3f\u7684\u5168\u6d41\u7a0b\u7814\u7a76\u5de5\u5177',
    'proj.toolkit.more': '\u66f4\u591a Skill \u6301\u7eed\u5f00\u53d1\u4e2d...',
    'proj.misinfo.title': '\u793e\u5a92 UGC \u771f\u5047\u4fe1\u606f\u8bc6\u522b\u6a21\u578b',
    'proj.misinfo.desc': '\u57fa\u4e8e\u968f\u673a\u68ee\u6797\u3001XGBoost\u3001SVM \u7684 UGC \u771f\u5b9e\u6027\u5206\u7c7b\u673a\u5668\u5b66\u4e60\u6a21\u578b\u3002\u5728 5000+ \u6807\u6ce8\u6837\u672c\u4e0a\u4e09\u5206\u7c7b\u51c6\u786e\u7387\u8fbe 79.8%\u3002<strong>\u6700\u4f73\u6280\u672f\u5956\u3002</strong>',
    'proj.viewgithub': '\u5728 GitHub \u4e0a\u67e5\u770b',
    'proj.afi.arch': '\u7cfb\u7edf\u67b6\u6784',
    'proj.afi.insights': '\u67e5\u770b\u6d1e\u5bdf',
    'nav.insights': '\u6d1e\u5bdf',
    'contact.title': '\u8054\u7cfb\u6211',
    'contact.desc': '\u6b22\u8fce\u8054\u7cfb\u6211\u2014\u2014\u65e0\u8bba\u662f\u5408\u4f5c\u3001\u673a\u4f1a\uff0c\u8fd8\u662f\u804a\u804a AI \u4e0e\u7ecf\u6d4e\u5b66\u3002',
    'hero.resume': '\u4e0b\u8f7d\u7b80\u5386',
    'footer.text': '\u00a9 2026 \u5468\u82b7\u4e50. \u7528\u597d\u5947\u5fc3\u548c Claude Code \u6784\u5efa\u3002',
    'chat.badge': '\u8bd5\u8bd5\u6211\u7684 AI \u52a9\u624b\uff01',
    'chat.assistant.name': '\u82b7\u4e50\u7684 AI \u52a9\u624b',
    'chat.assistant.subtitle': '\u5173\u4e8e\u6211\u7684\u4efb\u4f55\u95ee\u9898\u90fd\u53ef\u4ee5\u95ee',
    'chat.welcome': '\u4f60\u597d\uff01\ud83d\udc4b \u6211\u662f\u82b7\u4e50\u7684 AI \u52a9\u624b\u3002\u5173\u4e8e\u5979\u7684\u80cc\u666f\u3001\u7ecf\u5386\u3001\u9879\u76ee\u6216\u6280\u80fd\uff0c\u90fd\u53ef\u4ee5\u95ee\u6211\uff01',
    'chat.placeholder': '\u8f93\u5165\u4f60\u7684\u95ee\u9898...',
    'chat.placeholder.insights': '\u95ee\u95ee AI \u8d8b\u52bf...',
    'chat.thinking': '\u601d\u8003\u4e2d...',
    'chat.error': '\u62b1\u6b49\uff0c\u76ee\u524d\u8fde\u63a5\u51fa\u4e86\u70b9\u95ee\u9898\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\uff0c\u6216\u901a\u8fc7\u90ae\u4ef6\u8054\u7cfb\uff01',
    'chat.mode.personal': '\u95ee\u6211',
    'chat.mode.insights': 'AI \u6d1e\u5bdf',
    'chat.welcome.insights': '\u4f60\u597d\uff01\ud83d\udc4b \u53ef\u4ee5\u95ee\u6211\u5173\u4e8e AI \u8d8b\u52bf\u3001\u6bcf\u65e5\u4fe1\u53f7\u6216\u6bcf\u5468\u6df1\u5ea6\u6d1e\u5bdf\u7684\u95ee\u9898\u3002\u6240\u6709\u56de\u7b54\u57fa\u4e8e\u82b7\u4e50\u81ea\u5efa\u7684\u60c5\u62a5\u6570\u636e\u5e93\u548c\u5979\u7684\u539f\u521b\u5206\u6790\u89c2\u70b9\u3002',
    'chat.suggest.personal.1': '\u5979\u9002\u5408\u505a\u4ec0\u4e48\u5de5\u4f5c\uff1f',
    'chat.suggest.personal.2': '\u8fd9\u4e2a\u7f51\u7ad9\u548c\u804a\u5929\u673a\u5668\u4eba\u662f\u600e\u4e48\u505a\u7684\uff1f',
    'chat.suggest.insights.1': '\u6700\u8fd1 AI \u9886\u57df\u6700\u503c\u5f97\u5173\u6ce8\u7684\u8d8b\u52bf\u662f\u4ec0\u4e48\uff1f',
    'chat.suggest.insights.2': 'AI Agent \u7684\u53d1\u5c55\u673a\u4f1a\u6709\u54ea\u4e9b\uff1f'
  }
};

// === Language Toggle ===
let currentLang = localStorage.getItem('lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const t = translations[lang] && translations[lang][key];
    if (!t) return;
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = t;
    } else {
      el.textContent = t;
    }
  });

  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const t = translations[lang] && translations[lang][key];
    if (t) el.placeholder = t;
  });

  // Update featured badge via CSS
  updateFeaturedBadge(lang);

  // Update lang toggle button text
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = lang === 'zh' ? '中 | EN' : 'EN | 中';
  });
}

function updateFeaturedBadge(lang) {
  const style = document.getElementById('i18n-style');
  if (style) style.remove();
  if (lang === 'zh') {
    const s = document.createElement('style');
    s.id = 'i18n-style';
    s.textContent = '.project-card.featured::before { content: "\u91cd\u70b9\u9879\u76ee"; }';
    document.head.appendChild(s);
  }
}

function toggleLang() {
  setLang(currentLang === 'en' ? 'zh' : 'en');
}

// Init language on load
document.addEventListener('DOMContentLoaded', () => {
  // Bind both desktop and mobile lang toggles
  document.getElementById('langToggle').addEventListener('click', toggleLang);
  document.getElementById('langToggleMobile').addEventListener('click', toggleLang);

  // Apply saved language
  setLang(currentLang);
});

// === Theme Toggle ===
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.innerHTML = theme === 'dark'
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

// Init theme
const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// === Mobile Menu ===
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('active'));
});

// === Scroll Animations ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .project-card, .timeline-item, .contact-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// === Nav scroll effect ===
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.style.boxShadow = window.scrollY > 10
    ? '0 1px 8px rgba(0,0,0,0.08)' : 'none';
});

// === Chat Widget ===
const WORKER_URL = 'https://amb2r.top';

const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

let chatOpen = false;
let chatMode = 'personal'; // 'personal' or 'insights'
let chatHistory = []; // conversation history for multi-turn
const chatCache = { personal: { html: null, history: [] }, insights: { html: null, history: [] } };

// Add initial suggested questions
addSuggestedQuestions('personal');

// Show chat badge hint after 3 seconds
setTimeout(() => {
  const badge = chatToggle.querySelector('.chat-badge');
  if (badge) badge.classList.add('visible');
}, 3000);

chatToggle.addEventListener('click', () => {
  chatOpen = !chatOpen;
  chatPanel.classList.toggle('active', chatOpen);
  if (chatOpen) {
    chatInput.focus();
    const badge = chatToggle.querySelector('.chat-badge');
    if (badge) badge.classList.remove('visible');
    chatToggle.classList.add('no-pulse');
  }
});

chatClose.addEventListener('click', () => {
  chatOpen = false;
  chatPanel.classList.remove('active');
});

// Mode tab switching
document.querySelectorAll('.chat-mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const newMode = tab.dataset.mode;
    if (newMode === chatMode) return;
    // Save current mode's state
    chatCache[chatMode].html = chatMessages.innerHTML;
    chatCache[chatMode].history = chatHistory;
    chatMode = newMode;
    document.querySelectorAll('.chat-mode-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // Restore or initialize
    if (chatCache[chatMode].html !== null) {
      chatMessages.innerHTML = chatCache[chatMode].html;
      chatHistory = chatCache[chatMode].history;
    } else {
      chatMessages.innerHTML = '';
      chatHistory = [];
      const welcomeKey = chatMode === 'insights' ? 'chat.welcome.insights' : 'chat.welcome';
      addMessage(translations[currentLang][welcomeKey], 'bot');
      addSuggestedQuestions(chatMode);
    }
    // Update placeholder
    const placeholderKey = chatMode === 'insights' ? 'chat.placeholder.insights' : 'chat.placeholder';
    chatInput.placeholder = translations[currentLang][placeholderKey];
    chatInput.focus();
  });
});

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `chat-message ${type}`;
  msg.innerHTML = `<p>${text}</p>`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

function addSuggestedQuestions(mode) {
  const prefix = mode === 'insights' ? 'chat.suggest.insights' : 'chat.suggest.personal';
  const container = document.createElement('div');
  container.className = 'chat-suggestions';
  for (let i = 1; i <= 3; i++) {
    const text = translations[currentLang][`${prefix}.${i}`];
    if (!text) continue;
    const btn = document.createElement('button');
    btn.className = 'chat-suggestion-btn';
    btn.textContent = text;
    btn.addEventListener('click', () => {
      chatInput.value = text;
      sendMessage();
      // Remove suggestions after clicking
      const suggestions = chatMessages.querySelector('.chat-suggestions');
      if (suggestions) suggestions.remove();
    });
    container.appendChild(btn);
  }
  chatMessages.appendChild(container);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  chatSend.disabled = true;
  // Remove suggested questions once user sends a message
  const suggestions = chatMessages.querySelector('.chat-suggestions');
  if (suggestions) suggestions.remove();
  addMessage(text, 'user');

  const thinkingText = translations[currentLang]['chat.thinking'];
  const botMsg = addMessage(thinkingText, 'bot typing');

  const endpoint = chatMode === 'insights' ? WORKER_URL + '/api/insights' : WORKER_URL + '/api/chat';

  chatHistory.push({ role: 'user', content: text });

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text, history: chatHistory.slice(0, -1) })
    });

    if (res.status === 429) {
      botMsg.className = 'chat-message bot';
      botMsg.querySelector('p').textContent = currentLang === 'zh' ? '请求太频繁，请稍后再试。' : 'Too many requests. Please wait a moment.';
      chatSend.disabled = false;
      chatInput.focus();
      return;
    }
    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    botMsg.className = 'chat-message bot';
    botMsg.querySelector('p').innerHTML = formatResponse(data.answer);
    chatHistory.push({ role: 'assistant', content: data.answer });
  } catch (err) {
    botMsg.className = 'chat-message bot';
    botMsg.querySelector('p').textContent = translations[currentLang]['chat.error'];
  }

  chatSend.disabled = false;
  chatInput.focus();
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

chatSend.addEventListener('click', sendMessage);
let isIMEComposing = false;
chatInput.addEventListener('compositionstart', () => { isIMEComposing = true; });
chatInput.addEventListener('compositionend', () => {
  isIMEComposing = false;
  // Mark that composition just ended — ignore the very next Enter keydown
  chatInput._justComposed = true;
  setTimeout(() => { chatInput._justComposed = false; }, 100);
});
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing && !isIMEComposing && !chatInput._justComposed) sendMessage();
});
