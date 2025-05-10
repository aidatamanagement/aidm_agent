const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/create-conversation', async (req, res) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': process.env.TAVUS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        replica_id: "r9fa0878977a",
        conversation_name: "Tavus Chat Session",
        persona_id: "",
        conversational_context: "",
        properties: {
          max_call_duration: 3600,
          participant_left_timeout: 60,
          participant_absent_timeout: 300,
          enable_recording: true,
          enable_closed_captions: true,
          apply_greenscreen: false,
          language: "english"
        }
      })
    };

    const response = await fetch('https://tavusapi.com/v2/conversations', options);

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    const data = await response.json();
    
    // Check if the response contains the conversation URL
    if (!data.conversation_url) {
      throw new Error('No conversation URL in response');
    }

    res.json({
      join_url: data.conversation_url,
      conversation_id: data.conversation_id,
      status: data.status
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// New endpoint to end conversation
router.post('/end-conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const response = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}/end`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.TAVUS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to end conversation');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error ending conversation:', error);
    res.status(500).json({ error: 'Failed to end conversation' });
  }
});

module.exports = router; 