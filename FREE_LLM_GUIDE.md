# 🆓 Free LLM API Keys Guide

Get free API keys for your AI face analysis app! Here are the best options:

## 🚀 **Groq** (Recommended - Super Fast & Free)
**Free tier**: 100 requests/day  
**Speed**: Sub-second responses  
**Cost**: $0  

### How to get Groq API key:
1. Go to https://console.groq.com/
2. Sign up with Google/GitHub
3. Click "Create API Key"
4. Copy your key
5. Add to your environment: `GROQ_API_KEY=your_key_here`

## 🤗 **Hugging Face** (Already Working!)
**Free tier**: 30,000 requests/month  
**Cost**: $0  
**Your current setup**: Already integrated  

### How to get Hugging Face API key:
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name (e.g., "Face Analysis")
4. Select "Read" permissions
5. Copy your key
6. Add to your environment: `HUGGINGFACE_API_KEY=your_key_here`

## 🎯 **OpenAI** (You already have this!)
**Cost**: ~$0.002 per 1K tokens  
**Models**: GPT-3.5-turbo, GPT-4  

### How to get OpenAI API key:
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy your key
4. Add to your environment: `OPENAI_API_KEY=your_key_here`

## 🌟 **Together AI** (Alternative)
**Free tier**: $25 credit monthly  
**Models**: Llama 2, Mistral, CodeLlama  

### How to get Together AI key:
1. Go to https://together.ai/
2. Sign up
3. Go to API Keys section
4. Create new key
5. Add to your environment: `TOGETHER_API_KEY=your_key_here`

## 🔧 **How to Add API Keys to Your Project**

### Option 1: Environment Variables (Recommended)
Create a `.env` file in your backend folder:

```bash
# .env file
GROQ_API_KEY=gsk_your_groq_key_here
HUGGINGFACE_API_KEY=hf_your_hf_key_here
OPENAI_API_KEY=sk-your_openai_key_here
```

### Option 2: Render Environment Variables
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add each key:
   - `GROQ_API_KEY` = your_groq_key
   - `HUGGINGFACE_API_KEY` = your_hf_key
   - `OPENAI_API_KEY` = your_openai_key

### Option 3: Railway Environment Variables
1. Go to your Railway dashboard
2. Select your project
3. Go to "Variables" tab
4. Add each key

## 🎯 **Priority Order for Your App**

Your backend will try APIs in this order:
1. **Groq** (fastest, free)
2. **OpenAI** (reliable, low cost)
3. **Hugging Face** (free, already working)
4. **Local fallback** (no API needed)

## 💡 **Pro Tips**

- **Start with Groq**: It's free and super fast
- **Keep Hugging Face**: You already have it working
- **Add OpenAI**: For backup and better quality
- **Test locally**: Use `.env` file for development
- **Deploy with keys**: Add to Render/Railway environment

## 🚨 **Security Notes**

- Never commit API keys to GitHub
- Use environment variables
- Rotate keys regularly
- Monitor usage in dashboard

## 📊 **Cost Comparison**

| Service | Free Tier | Cost After Free |
|---------|-----------|-----------------|
| Groq | 100 req/day | $0.10/1M tokens |
| Hugging Face | 30k req/month | $0.06/1M tokens |
| OpenAI | $5 credit | $0.002/1K tokens |
| Together AI | $25 credit | $0.20/1M tokens |

## 🎉 **Get Started Now!**

1. Get your **Groq API key** (fastest setup)
2. Add it to your environment
3. Deploy your backend
4. Enjoy free AI insights! 🚀

Your app will automatically use the best available API and fall back gracefully if any fail. 