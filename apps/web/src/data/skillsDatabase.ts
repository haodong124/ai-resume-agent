// apps/web/src/data/skillsDatabase.ts
export const SKILLS_DATABASE = {
  // 按专业分类的技能库
  majors: {
    '计算机科学': {
      core: ['Python', 'Java', 'C++', '数据结构', '算法', '操作系统', '计算机网络', '数据库原理'],
      software: ['Git', 'Docker', 'Kubernetes', 'Linux', 'VS Code', 'IntelliJ IDEA', 'Eclipse', 'Visual Studio'],
      frameworks: ['React', 'Vue.js', 'Angular', 'Spring Boot', 'Django', 'Express.js', 'Flask', 'Next.js', 'Nuxt.js'],
      databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite', 'Cassandra'],
      cloud: ['AWS', 'Azure', 'Google Cloud', '阿里云', '腾讯云', '华为云'],
      testing: ['JUnit', 'Selenium', 'Jest', 'Mocha', 'Chai', 'Postman', 'Cypress'],
      security: ['网络安全', '加密技术', '身份认证', '防火墙', '渗透测试']
    },
    '电子工程': {
      core: ['电路设计', '嵌入式系统', 'FPGA', '信号处理', '模拟电路', '数字电路', '通信原理', '电磁场理论'],
      software: ['MATLAB', 'Multisim', 'Keil', 'Altium Designer', 'Cadence', 'Proteus', 'Quartus', 'Vivado'],
      hardware: ['Arduino', 'STM32', 'Raspberry Pi', '示波器', '逻辑分析仪', '信号发生器', '万用表', '频谱分析仪'],
      protocols: ['I2C', 'SPI', 'UART', 'USB', 'CAN', 'Ethernet', 'Bluetooth', 'WiFi'],
      tools: ['PCB设计', '电路仿真', '射频设计', '天线设计', 'EMC测试']
    },
    '机械工程': {
      core: ['机械设计', '材料力学', '热力学', '流体力学', '控制理论', '制造工艺'],
      software: ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'MATLAB', 'Pro/E', 'UG/NX'],
      manufacturing: ['CNC加工', '3D打印', '铸造', '焊接', '冲压', '注塑'],
      analysis: ['有限元分析', '计算流体力学', '振动分析', '疲劳分析']
    },
    '土木工程': {
      core: ['结构力学', '土力学', '建筑材料', '工程测量', '施工技术', '项目管理'],
      software: ['AutoCAD', 'Revit', 'PKPM', 'Midas', 'SAP2000', 'ETABS'],
      design: ['结构设计', '地基处理', '桥梁工程', '隧道工程', '道路设计'],
      standards: ['建筑规范', '抗震设计', '绿色建筑', 'BIM技术']
    },
    '金融学': {
      core: ['财务分析', '投资学', '公司金融', '金融市场', '风险管理', '计量经济学'],
      software: ['Excel/VBA', 'Python', 'R', 'MATLAB', 'Bloomberg', 'Wind'],
      analysis: ['财务建模', '估值分析', '信用分析', '投资组合管理'],
      certifications: ['CFA', 'FRM', 'CPA', 'ACCA', '证券从业资格']
    },
    '市场营销': {
      core: ['市场调研', '品牌管理', '消费者行为', '数字营销', '广告学', '销售管理'],
      digital: ['SEO/SEM', '社交媒体营销', '内容营销', '电子邮件营销', '数据分析'],
      tools: ['Google Analytics', 'Facebook Ads', '微信营销', '微博营销', '抖音营销'],
      strategy: ['营销策划', '渠道管理', '客户关系管理', '品牌推广']
    },
    '人力资源': {
      core: ['招聘与选拔', '培训开发', '绩效管理', '薪酬福利', '劳动关系', '组织行为学'],
      tools: ['HRIS系统', 'ATS招聘系统', '测评工具', '员工调研'],
      laws: ['劳动法', '社保政策', '劳动合同法', '就业促进法'],
      development: ['人才盘点', '继任计划', '领导力发展', '组织诊断']
    },
    '医学': {
      core: ['解剖学', '生理学', '病理学', '药理学', '诊断学', '内科学', '外科学'],
      clinical: ['病史采集', '体格检查', '实验室检查', '影像学检查', '手术技能'],
      specialties: ['心内科', '神经科', '骨科', '儿科', '妇产科', '急诊科'],
      research: ['临床试验', '流行病学', '循证医学', '生物统计学']
    },
    '法律': {
      core: ['民法', '刑法', '商法', '行政法', '诉讼法', '国际法'],
      practice: ['合同审查', '法律文书写作', '庭审技巧', '证据收集'],
      specializations: ['知识产权', '公司法务', '金融法', '劳动法', '房地产法'],
      certifications: ['法律职业资格', '律师执业证', '企业法律顾问']
    },
    '建筑设计': {
      core: ['建筑设计原理', '建筑史', '建筑物理', '建筑构造', '城市规划'],
      software: ['AutoCAD', 'SketchUp', 'Rhino', 'Revit', '3ds Max', 'V-Ray', 'Lumion'],
      design: ['方案设计', '施工图设计', '深化设计', '景观设计'],
      standards: ['建筑规范', '绿色建筑', '无障碍设计', '抗震设计']
    }
  },
  
  // 按职位分类的技能需求
  positions: {
    '产品经理': {
      必备: ['需求分析', '产品设计', '数据分析', '项目管理', '用户体验设计', '市场调研'],
      工具: ['Axure', 'Figma', 'Sketch', 'JIRA', 'Confluence', 'Excel', 'SQL', 'Tableau'],
      软技能: ['沟通协调', '逻辑思维', '用户研究', '商业思维', '团队协作', '决策能力'],
      进阶: ['A/B测试', '增长黑客', '商业模式设计', '产品战略规划', '数据驱动决策']
    },
    '前端工程师': {
      必备: ['HTML/CSS', 'JavaScript', 'React/Vue', '响应式设计', '浏览器兼容性', '性能优化'],
      工具: ['Webpack', 'Git', 'Chrome DevTools', 'npm/yarn', 'ESLint', 'Prettier'],
      进阶: ['TypeScript', '微前端', 'PWA', 'WebAssembly', '跨端开发', '图形渲染'],
      框架库: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Redux', 'Vuex']
    },
    '后端工程师': {
      必备: ['Java/Python/Go', '数据库设计', 'API开发', '系统架构', '缓存机制', '消息队列'],
      工具: ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'Postman', 'Swagger'],
      进阶: ['微服务架构', '分布式系统', '容器化部署', '服务网格', '云原生'],
      数据库: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra']
    },
    '数据科学家': {
      必备: ['Python/R', '统计学', '机器学习', '数据可视化', '特征工程', '模型评估'],
      工具: ['Jupyter', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
      进阶: ['深度学习', '自然语言处理', '计算机视觉', '强化学习', '时间序列分析'],
      平台: ['Hadoop', 'Spark', 'Kafka', 'Airflow', 'Tableau', 'Power BI']
    },
    'UI/UX设计师': {
      必备: ['用户研究', '交互设计', '视觉设计', '原型设计', '可用性测试', '设计系统'],
      工具: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InVision'],
      进阶: ['动效设计', '3D设计', 'AR/VR设计', '服务设计', '品牌设计'],
      理论: ['设计心理学', '认知科学', '色彩理论', '排版设计', '用户体验原则']
    },
    '移动开发工程师': {
      必备: ['Android/iOS开发', '原生API', '性能优化', '内存管理', '网络编程'],
      工具: ['Android Studio', 'Xcode', 'Git', 'CocoaPods', 'Gradle'],
      跨平台: ['React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova'],
      进阶: ['原生模块开发', '热更新', '推送服务', '支付集成', '地图服务']
    },
    'DevOps工程师': {
      必备: ['CI/CD', '容器化', '监控告警', '日志分析', '基础设施即代码', '自动化部署'],
      工具: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'Ansible', 'Terraform'],
      云平台: ['AWS', 'Azure', 'GCP', '阿里云', '腾讯云'],
      进阶: ['服务网格', '混沌工程', '安全运维', '成本优化', '灾备方案']
    },
    '网络安全工程师': {
      必备: ['渗透测试', '漏洞分析', '安全加固', '应急响应', '安全审计', '风险评估'],
      工具: ['Nmap', 'Metasploit', 'Burp Suite', 'Wireshark', 'Kali Linux', 'Nessus'],
      认证: ['CISSP', 'CEH', 'CISP', 'CISA', 'OSCP'],
      进阶: ['APT防护', '零信任架构', '安全运营中心', '威胁情报', '区块链安全']
    },
    '嵌入式开发工程师': {
      必备: ['C/C++', 'RTOS', '硬件接口', '驱动开发', '低功耗设计', '实时系统'],
      工具: ['Keil', 'IAR', 'GCC', 'JTAG', '逻辑分析仪', '示波器'],
      平台: ['ARM', 'STM32', 'Arduino', 'Raspberry Pi', 'ESP32'],
      进阶: ['FPGA开发', 'DSP算法', '无线通信', '物联网协议', '边缘计算']
    },
    '云计算架构师': {
      必备: ['云架构设计', '微服务', '容器编排', '负载均衡', '灾备设计', '成本优化'],
      平台: ['AWS', 'Azure', 'GCP', '阿里云', '腾讯云', '华为云'],
      进阶: ['多云管理', '混合云', '无服务器架构', '边缘计算', 'AI平台'],
      认证: ['AWS Solution Architect', 'Azure Architect', 'GCP Professional Cloud Architect']
    },
    '人工智能工程师': {
      必备: ['机器学习', '深度学习', '神经网络', '自然语言处理', '计算机视觉'],
      框架: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'OpenCV'],
      工具: ['Jupyter', 'Docker', 'Kubernetes', 'MLflow', 'Weights & Biases'],
      进阶: ['强化学习', '生成对抗网络', '联邦学习', 'AutoML', 'MLOps']
    },
    '区块链开发工程师': {
      必备: ['智能合约', '共识算法', '密码学', '分布式系统', '去中心化应用'],
      平台: ['Ethereum', 'Hyperledger', 'EOS', 'Polkadot', 'Cosmos'],
      工具: ['Solidity', 'Web3.js', 'Truffle', 'Remix', 'Metamask'],
      进阶: ['DeFi开发', 'NFT平台', '跨链协议', 'Layer2解决方案', '隐私保护']
    },
    '游戏开发工程师': {
      必备: ['游戏引擎', '3D图形', '物理引擎', '动画系统', '音频处理', '网络同步'],
      引擎: ['Unity', 'Unreal Engine', 'Cocos2d', 'Godot'],
      编程: ['C#', 'C++', 'Lua', 'Python', 'Shader编程'],
      进阶: ['VR/AR开发', '多人在线', '性能优化', '跨平台发布', '游戏AI']
    },
    '大数据工程师': {
      必备: ['Hadoop生态', 'Spark', '数据仓库', '流处理', '批处理', '数据治理'],
      工具: ['Kafka', 'Flink', 'Hive', 'HBase', 'Airflow', 'Superset'],
      云服务: ['AWS EMR', 'Azure HDInsight', 'GCP Dataproc', '阿里云MaxCompute'],
      进阶: ['实时数仓', '湖仓一体', '数据血缘', '数据质量', '数据安全']
    },
    '测试工程师': {
      必备: ['测试用例设计', '自动化测试', '性能测试', '安全测试', '兼容性测试'],
      工具: ['Selenium', 'JMeter', 'Postman', 'LoadRunner', 'Appium'],
      进阶: ['持续集成测试', 'A/B测试', '混沌测试', '探索性测试', '测试平台开发'],
      编程: ['Python', 'Java', 'JavaScript', 'Shell脚本']
    }
  },
  
  // 技能详细描述
  skillDetails: {
    'React': {
      description: '用于构建用户界面的JavaScript库，采用组件化开发模式',
      capabilities: [
        '开发单页应用(SPA)',
        '组件化开发',
        '状态管理',
        '虚拟DOM优化',
        '服务端渲染',
        '代码分割',
        'Hooks编程'
      ],
      relatedSkills: ['Redux', 'React Router', 'Next.js', 'MobX', 'Zustand'],
      learningPath: [
        'JavaScript基础',
        'ES6+语法',
        '组件生命周期',
        '状态管理',
        '性能优化',
        '测试'
      ],
      resources: [
        'React官方文档',
        'React Hooks指南',
        'Redux官方文档',
        'React最佳实践'
      ]
    },
    'Vue.js': {
      description: '渐进式JavaScript框架，易学易用，性能出色',
      capabilities: [
        '响应式数据绑定',
        '组件系统',
        '路由管理',
        '状态管理',
        '服务端渲染',
        '构建工具集成'
      ],
      relatedSkills: ['Vuex', 'Vue Router', 'Nuxt.js', 'Element UI', 'Vuetify'],
      learningPath: [
        'HTML/CSS/JavaScript基础',
        'Vue核心概念',
        '组件开发',
        '路由和状态管理',
        '构建和部署'
      ],
      resources: [
        'Vue官方文档',
        'Vue CLI指南',
        'Vuex状态管理',
        'Vue 3 Composition API'
      ]
    },
    'Python': {
      description: '高级编程语言，语法简洁，生态系统丰富',
      capabilities: [
        'Web开发',
        '数据分析',
        '人工智能',
        '自动化脚本',
        '科学计算',
        '网络爬虫'
      ],
      relatedSkills: ['Django', 'Flask', 'Pandas', 'NumPy', 'TensorFlow', 'Scrapy'],
      learningPath: [
        'Python基础语法',
        '面向对象编程',
        '文件操作',
        '异常处理',
        '模块和包',
        '虚拟环境'
      ],
      resources: [
        'Python官方文档',
        'Python标准库',
        'PEP 8代码规范',
        'Python进阶指南'
      ]
    },
    'Java': {
      description: '面向对象编程语言，企业级应用开发首选',
      capabilities: [
        '企业级应用开发',
        'Android开发',
        '大数据处理',
        '微服务架构',
        '并发编程',
        'JVM调优'
      ],
      relatedSkills: ['Spring Boot', 'Hibernate', 'Maven', 'JUnit', 'Kafka', 'Redis'],
      learningPath: [
        'Java基础语法',
        '面向对象编程',
        '集合框架',
        '多线程编程',
        'JVM原理',
        '框架应用'
      ],
      resources: [
        'Java官方文档',
        'Effective Java',
        'Java并发编程实战',
        'Spring官方文档'
      ]
    },
    'JavaScript': {
      description: 'Web前端开发核心语言，支持函数式和面向对象编程',
      capabilities: [
        'DOM操作',
        '异步编程',
        '事件处理',
        '模块化开发',
        '闭包和作用域',
        '原型链'
      ],
      relatedSkills: ['TypeScript', 'Node.js', 'ES6+', 'Babel', 'Webpack', 'npm'],
      learningPath: [
        '基础语法',
        'DOM和BOM',
        '异步编程',
        'ES6+新特性',
        '模块系统',
        '构建工具'
      ],
      resources: [
        'MDN Web Docs',
        'JavaScript高级程序设计',
        '你不知道的JavaScript',
        '现代JavaScript教程'
      ]
    },
    'Docker': {
      description: '容器化平台，实现应用的快速部署和迁移',
      capabilities: [
        '容器化部署',
        '镜像管理',
        '网络配置',
        '数据持久化',
        '多容器编排',
        '安全配置'
      ],
      relatedSkills: ['Kubernetes', 'Docker Compose', 'Docker Swarm', '容器安全', '镜像优化'],
      learningPath: [
        '容器基础概念',
        'Docker安装配置',
        '镜像和容器操作',
        '网络和存储',
        'Dockerfile编写',
        '生产环境部署'
      ],
      resources: [
        'Docker官方文档',
        'Docker最佳实践',
        '容器安全指南',
        'Docker Compose文档'
      ]
    },
    'Kubernetes': {
      description: '容器编排平台，管理容器化应用的部署、扩展和运维',
      capabilities: [
        '集群管理',
        '服务发现',
        '负载均衡',
        '自动扩缩容',
        '滚动更新',
        '存储编排'
      ],
      relatedSkills: ['Helm', 'Istio', 'Prometheus', 'Kustomize', 'Operator模式', 'Service Mesh'],
      learningPath: [
        'K8s基础概念',
        '集群搭建',
        'Pod和Service',
        'Deployment和StatefulSet',
        '配置管理',
        '监控和日志'
      ],
      resources: [
        'Kubernetes官方文档',
        'K8s实战指南',
        'CKA认证资料',
        '云原生技术'
      ]
    },
    'AWS': {
      description: '亚马逊云服务平台，提供全面的云计算服务',
      capabilities: [
        'EC2虚拟机管理',
        'S3对象存储',
        'RDS数据库服务',
        'Lambda无服务器计算',
        'CloudFront内容分发',
        'IAM身份管理'
      ],
      relatedSkills: ['云架构设计', '成本优化', '安全配置', '灾备方案', '监控告警', 'DevOps集成'],
      learningPath: [
        'AWS基础服务',
        '账户和权限管理',
        '网络和安全',
        '存储和数据库',
        '计算服务',
        '监控和优化'
      ],
      resources: [
        'AWS官方文档',
        'AWS培训认证',
        '云架构最佳实践',
        'AWS解决方案'
      ]
    },
    '机器学习': {
      description: '人工智能核心领域，让计算机从数据中学习规律',
      capabilities: [
        '监督学习',
        '无监督学习',
        '强化学习',
        '特征工程',
        '模型评估',
        '超参数调优'
      ],
      relatedSkills: ['深度学习', '统计学', '数据可视化', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
      learningPath: [
        '数学基础',
        '统计学原理',
        '经典算法',
        '实践项目',
        '模型优化',
        '部署应用'
      ],
      resources: [
        '机器学习实战',
        '统计学习方法',
        'Scikit-learn文档',
        'Kaggle竞赛'
      ]
    },
    '数据分析': {
      description: '从数据中提取有价值信息的过程，支持业务决策',
      capabilities: [
        '数据清洗',
        '统计分析',
        '可视化展示',
        '报表制作',
        'A/B测试',
        '预测建模'
      ],
      relatedSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', '统计学'],
      learningPath: [
        '数据基础',
        'SQL查询',
        '统计分析',
        '可视化工具',
        '业务理解',
        '报告撰写'
      ],
      resources: [
        '数据分析实战',
        '统计学基础',
        'Tableau指南',
        '数据科学手册'
      ]
    },
    'UI设计': {
      description: '用户界面设计，关注产品的视觉呈现和交互体验',
      capabilities: [
        '视觉设计',
        '交互设计',
        '原型制作',
        '设计规范',
        '动效设计',
        '设计系统'
      ],
      relatedSkills: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'Principle'],
      learningPath: [
        '设计基础',
        '软件工具',
        '设计原则',
        '用户体验',
        '项目实践',
        '作品集制作'
      ],
      resources: [
        '设计心理学',
        '简约至上',
        '写给大家看的设计书',
        'Figma设计指南'
      ]
    },
    '项目管理': {
      description: '规划、执行和控制项目活动，确保项目目标达成',
      capabilities: [
        '项目规划',
        '进度控制',
        '风险管理',
        '团队协调',
        '资源分配',
        '质量保证'
      ],
      relatedSkills: ['敏捷开发', 'Scrum', 'JIRA', '甘特图', '风险管理', '沟通协调'],
      learningPath: [
        '项目管理基础',
        '方法论学习',
        '工具应用',
        '实践案例',
        '团队管理',
        '持续改进'
      ],
      resources: [
        'PMP指南',
        '敏捷宣言',
        '项目管理实战',
        'Scrum指南'
      ]
    },
    '网络安全': {
      description: '保护网络系统和数据免受攻击、破坏或未经授权的访问',
      capabilities: [
        '漏洞扫描',
        '渗透测试',
        '安全加固',
        '应急响应',
        '安全审计',
        '风险评估'
      ],
      relatedSkills: ['防火墙', '入侵检测', '加密技术', '身份认证', '安全运维', '合规审计'],
      learningPath: [
        '安全基础',
        '攻击技术',
        '防御策略',
        '安全工具',
        '法规标准',
        '应急响应'
      ],
      resources: [
        '网络安全基础',
        '渗透测试指南',
        'CISSP官方指南',
        'OWASP安全标准'
      ]
    },
    '云计算': {
      description: '通过网络提供计算服务，包括服务器、存储、数据库等',
      capabilities: [
        '云架构设计',
        '服务迁移',
        '成本优化',
        '安全配置',
        '监控运维',
        '灾备方案'
      ],
      relatedSkills: ['AWS', 'Azure', 'GCP', '容器技术', '微服务', 'DevOps'],
      learningPath: [
        '云基础概念',
        '主流平台',
        '服务选型',
        '架构设计',
        '安全合规',
        '优化运维'
      ],
      resources: [
        '云计算导论',
        '云架构设计',
        '云安全指南',
        '企业上云实践'
      ]
    },
    '区块链': {
      description: '分布式账本技术，提供去中心化、不可篡改的数据存储',
      capabilities: [
        '智能合约开发',
        '共识算法',
        '密码学应用',
        'DApp开发',
        'Token经济',
        '跨链技术'
      ],
      relatedSkills: ['Solidity', 'Web3.js', '以太坊', '超级账本', '密码学', '分布式系统'],
      learningPath: [
        '区块链基础',
        '密码学原理',
        '共识机制',
        '智能合约',
        'DApp开发',
        '生态应用'
      ],
      resources: [
        '区块链技术指南',
        '精通比特币',
        '以太坊白皮书',
        '智能合约开发'
      ]
    }
  }
}
