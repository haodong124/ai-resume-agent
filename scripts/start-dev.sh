echo "🚀 启动 AI Resume Agent 开发环境"

# 检查依赖
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建packages
echo "🔨 构建核心包..."
npm run build:packages

# 启动数据库
echo "🐘 启动数据库..."
docker-compose up -d postgres redis

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 5

# 运行数据库迁移
echo "🔄 运行数据库迁移..."
npm run db:migrate

# 启动开发服务器
echo "🌐 启动开发服务器..."
npm run dev
