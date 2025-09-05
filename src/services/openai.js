import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai = null;

if (apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
  });
} else {
  console.warn('OpenAI API key not found. Using mock responses.');
}

/**
 * Generates an AI interpretation of a dream
 * @param {string} dreamText - The dream description
 * @param {string[]} emotions - Associated emotions
 * @param {string[]} tags - Associated tags
 * @returns {Promise<string>} - AI interpretation
 */
export const generateDreamInterpretation = async (dreamText, emotions = [], tags = []) => {
  if (!dreamText?.trim()) {
    throw new Error('Dream text is required for interpretation');
  }

  // If no OpenAI API key, return mock response
  if (!openai) {
    return getMockInterpretation(dreamText, emotions, tags);
  }

  try {
    const systemPrompt = `You are a professional dream analyst with expertise in psychology, symbolism, and dream interpretation. Your role is to provide thoughtful, insightful, and personalized interpretations of dreams while being respectful of the dreamer's privacy and emotional state.

Guidelines for interpretation:
- Focus on universal symbols and psychological themes
- Consider the emotional context provided
- Offer multiple possible meanings when appropriate
- Be encouraging and supportive in tone
- Avoid making definitive claims about the dreamer's life
- Keep interpretations between 150-300 words
- Include practical insights when relevant
- Respect cultural and personal differences in symbolism`;

    const userPrompt = `Please interpret this dream:

Dream: "${dreamText}"

${emotions.length > 0 ? `Emotions felt: ${emotions.join(', ')}` : ''}
${tags.length > 0 ? `Key elements/tags: ${tags.join(', ')}` : ''}

Provide a thoughtful interpretation that explores possible meanings, psychological themes, and symbolic significance.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const interpretation = completion.choices[0]?.message?.content;
    
    if (!interpretation) {
      throw new Error('No interpretation received from AI');
    }

    return interpretation.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to mock interpretation on error
    return getMockInterpretation(dreamText, emotions, tags);
  }
};

/**
 * Analyzes dream patterns and provides insights
 * @param {Array} dreamEntries - Array of dream entries
 * @returns {Promise<Object>} - Pattern analysis
 */
export const analyzeDreamPatterns = async (dreamEntries) => {
  if (!dreamEntries || dreamEntries.length === 0) {
    return {
      insights: "Not enough dream data to analyze patterns. Keep logging your dreams to discover meaningful insights!",
      themes: [],
      emotionalTrends: [],
      recommendations: []
    };
  }

  // If no OpenAI API key, return mock analysis
  if (!openai) {
    return getMockPatternAnalysis(dreamEntries);
  }

  try {
    // Prepare dream data for analysis (limit to recent dreams for token efficiency)
    const recentDreams = dreamEntries.slice(0, 10).map(entry => ({
      date: entry.dreamDate,
      themes: entry.tags || [],
      emotions: entry.emotions || [],
      summary: entry.dreamText?.substring(0, 200) + '...' // Truncate for token efficiency
    }));

    const systemPrompt = `You are a dream pattern analyst specializing in identifying recurring themes, emotional patterns, and psychological insights from dream journals. Analyze the provided dream data and return insights in JSON format.

Return format:
{
  "insights": "2-3 sentences about overall patterns",
  "themes": ["theme1", "theme2", "theme3"],
  "emotionalTrends": ["trend1", "trend2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    const userPrompt = `Analyze these dream entries for patterns:

${JSON.stringify(recentDreams, null, 2)}

Identify recurring themes, emotional patterns, and provide actionable insights for personal growth.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No pattern analysis received from AI');
    }

    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, return structured fallback
      return {
        insights: response,
        themes: [],
        emotionalTrends: [],
        recommendations: []
      };
    }
  } catch (error) {
    console.error('Pattern analysis error:', error);
    return getMockPatternAnalysis(dreamEntries);
  }
};

/**
 * Mock interpretation for when OpenAI is not available
 */
const getMockInterpretation = (dreamText, emotions, tags) => {
  const interpretations = [
    "This dream appears to reflect themes of exploration and personal growth. The symbols and narrative suggest your subconscious is processing recent experiences and emotions. Consider how the dream's elements might relate to your current life circumstances and aspirations.",
    
    "Your dream contains rich symbolic content that may represent your inner journey and emotional state. The imagery suggests a desire for transformation or change in your life. Pay attention to the emotions you felt during the dream, as they often provide the most meaningful insights.",
    
    "This dream seems to be your mind's way of working through complex feelings and situations. The symbols present may represent different aspects of your personality or life experiences. Consider what areas of your life might benefit from the wisdom your subconscious is offering.",
    
    "The narrative structure of your dream suggests your psyche is actively processing and integrating experiences. The elements you've described often symbolize personal growth, relationships, or creative expression. Reflect on how these themes might apply to your waking life."
  ];

  // Add emotion-specific insights
  let emotionInsight = "";
  if (emotions.includes('fear') || emotions.includes('anxiety')) {
    emotionInsight = " The feelings of fear or anxiety in your dream may indicate areas where you're facing uncertainty or challenges in your waking life.";
  } else if (emotions.includes('joy') || emotions.includes('peace')) {
    emotionInsight = " The positive emotions in your dream suggest a sense of harmony and contentment with certain aspects of your life.";
  }

  const baseInterpretation = interpretations[Math.floor(Math.random() * interpretations.length)];
  return baseInterpretation + emotionInsight;
};

/**
 * Mock pattern analysis for when OpenAI is not available
 */
const getMockPatternAnalysis = (dreamEntries) => {
  const allTags = dreamEntries.flatMap(entry => entry.tags || []);
  const allEmotions = dreamEntries.flatMap(entry => entry.emotions || []);
  
  const tagCounts = {};
  const emotionCounts = {};
  
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  allEmotions.forEach(emotion => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });
  
  const topThemes = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);
    
  const topEmotions = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([emotion]) => emotion);

  return {
    insights: `Based on your ${dreamEntries.length} dream entries, you show recurring patterns around ${topThemes.join(', ')} themes. Your emotional landscape in dreams tends toward ${topEmotions.join(' and ')} feelings.`,
    themes: topThemes,
    emotionalTrends: topEmotions,
    recommendations: [
      "Continue journaling your dreams to identify deeper patterns",
      "Pay attention to recurring symbols and their personal meaning to you",
      "Consider how dream emotions relate to your waking life experiences"
    ]
  };
};
