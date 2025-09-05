// ========== apps/functions/track-interaction.js ==========
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { action, jobId, userId } = JSON.parse(event.body || '{}')
    
    // 这里应该记录到数据库，现在只是返回成功
    console.log('Tracking:', { action, jobId, userId })
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Interaction tracked'
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Tracking failed' 
      })
    }
  }
}
