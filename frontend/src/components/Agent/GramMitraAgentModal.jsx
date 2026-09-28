import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Square, 
  X, 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  CheckCircle2, 
  CloudRain, 
  Droplets,
  HelpCircle,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export const GramMitraAgentModal = ({ isOpen, onClose }) => {
  const { selectedLocation } = useLocation();
  const { language, playVoiceAdvisory, stopVoiceAdvisory, isPlayingVoice } = useLanguage();

  const activeVillage = selectedLocation?.village || selectedLocation?.panchayat || "स्थानीय ग्राम";
  const activeBlock = selectedLocation?.block || "क्षेत्रीय ब्लॉक";
  const activeDistrict = selectedLocation?.district || "जिला";

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: `राम-राम किसान भाई! मैं आपका ग्राममित्र AI कृषि सहायक हूँ। मैं आपके क्षेत्र **${activeVillage} (${activeBlock})** के मौसम, फसल सलाह, सिंचाई और रोग नियंत्रण में मदद कर सकता हूँ। आप मुझसे कुछ भी पूछ सकते हैं या बोलकर सवाल कर सकते हैं।`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Quick suggestions
  const quickPrompts = [
    { text: "आज वर्षा और मौसम कैसा रहेगा?", query: "आज मेरे क्षेत्र में वर्षा और मौसम का पूर्वानुमान क्या है?" },
    { text: "क्या आज सिंचाई करनी चाहिए?", query: "क्या आज मुझे गेहूँ या अन्य फसलों में सिंचाई करनी चाहिए?" },
    { text: "कीटनाशक स्प्रे करना सुरक्षित है?", query: "क्या आज खेत में कीटनाशक या खरपतवारनाशक का छिड़काव करना सुरक्षित है?" },
    { text: "पीला रतुआ रोग के लक्षण व उपाय", query: "गेहूँ में पीला रतुआ (Yellow Rust) के लक्षण दिखे हैं, तुरंत क्या उपाय करें?" },
    { text: "यूरिया खाद कब और कैसे डालें?", query: "इस मौसम में यूरिया और उर्वरक डालने का सही समय और तरीका क्या है?" }
  ];

  // Speech Recognition (Voice Input)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome/Edge or type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const { weather } = useWeather();
  const curTemp = weather ? weather.temperature : 28;
  const curHum = weather ? weather.humidity : 70;
  const curRain = weather ? weather.rainfall : 10;
  const curProb = weather ? weather.rainProbability : 50;

  // Generate intelligent response based on farmer's location, crop, and dynamic weather
  const generateAgentResponse = (userQuery) => {
    const q = userQuery.toLowerCase();
    const loc = activeVillage;
    const block = activeBlock;

    if (q.includes('वर्षा') || q.includes('बारिश') || q.includes('rain') || q.includes('मौसम') || q.includes('weather')) {
      return `🌦 **${loc} (${block}) मौसम पूर्वानुमान:**\n\n• आज आपके क्षेत्र में **${curRain} मिमी** वर्षा की संभावना (${curProb}% प्रायिकता) है।\n• अधिकतम तापमान **${curTemp}°C** तथा आर्द्रता **${curHum}%** रहेगी।\n• **सलाह:** खेत के मुख्य जल निकास नाले साफ रखें ताकि अधिक पानी आसानी से बाहर निकल सके। कटी हुई फसल या खाद की बोरियों को तिरपाल से ढक कर रखें।`;
    }

    if (q.includes('सिंचाई') || q.includes('irrigation') || q.includes('पानी')) {
      return `💧 **स्मार्ट सिंचाई परामर्श (${loc}):**\n\n• **${curRain > 2 ? 'सिंचाई स्थगित रखें (PAUSE IRRIGATION)' : 'सामान्य सिंचाई जारी रखें'}**\n• आगामी 24 घंटे में संभावित बारिश (**${curRain} मिमी**) और आर्द्रता (**${curHum}%**) को ध्यान में रखते हुए जल प्रबंधन करें।\n• अगली नमी समीक्षा कल सुबह 06:00 बजे की जाएगी।`;
    }

    if (q.includes('स्प्रे') || q.includes('spray') || q.includes('कीटनाशक') || q.includes('pesticide')) {
      return `🚫 **छिड़काव परामर्श (Foliar Spray Directive):**\n\n• ${curRain > 2 ? 'आज किसी भी रसायन या कीटनाशक का छिड़काव न करें! आगामी बारिश के कारण दवा धुल जाएगी।' : 'मौसम अनुकूल है, छिड़काव प्रातःकाल या शाम को तेज हवा न होने पर कर सकते हैं।'}\n• बारिश थमने के कम से कम **36 से 48 घंटे बाद** मौसम साफ होने पर ही अनुशंसित कीटनाशक का छिड़काव करें।`;
    }

    if (q.includes('पीला रतुआ') || q.includes('rust') || q.includes('रोग') || q.includes('disease') || q.includes('धब्बे')) {
      return `🦠 **रोग नियंत्रण सलाह (${loc}):**\n\n• आर्द्रता (${curHum}%) और ${curTemp}°C तापमान को देखते हुए गेहूँ में **पीला रतुआ (Yellow Rust)** और फफूंद के बीजाणु पनपने की निगरानी करें।\n• **लक्षण:** पत्तियों पर पीले रंग की धारियाँ या चूर्ण जैसी परत दिखना।\n• **उपाय:** बारिश रुकने और धूप निकलने पर **प्रोपिकोनाजोल 25% EC (टिल्ट)** 1 मिली प्रति लीटर पानी का छिड़काव करें।`;
    }

    if (q.includes('यूरिया') || q.includes('खाद') || q.includes('fertilizer') || q.includes('पोटाश')) {
      return `🧪 **उर्वरक एवं पोषण प्रबंधन:**\n\n• वर्षा से पहले खुली मिट्टी में यूरिया का टॉप-ड्रेसिंग न करें, क्योंकि तेज बारिश में नाइट्रोजन घुलकर बह जाती है (Leaching loss)।\n• बारिश रुकने और ऊपरी मिट्टी से अतिरिक्त पानी निकल जाने के बाद ही यूरिया डालें।\n• यदि जड़ विकास कमजोर है तो 1% 19:19:19 या पोटाश का हल्का छिड़काव मौसम साफ होने पर करें।`;
    }

    // Default intelligent agronomist response
    return `🌾 **ग्राममित्र AI कृषि परामर्श (${loc}, ${block}):**\n\nआपके सवाल "${userQuery}" के अनुसार:\n1. आपके क्षेत्र में वर्तमान तापमान **${curTemp}°C** और आर्द्रता **${curHum}%** है।\n2. वर्षा संभावना: **${curRain} मिमी** (${curProb}%)।\n3. आगामी मौसम को ध्यान में रखते हुए खेत के जल निकास नालों को दुरुस्त रखें।\n\nकिसी विशिष्ट फसल (गेहूँ, चना, सोयाबीन, कपास, मक्का) की अवस्था के अनुसार जानकारी चाहिए तो कृपया फसल का नाम लिखें।`;
  };

  const handleSend = (queryToSend = null) => {
    const text = queryToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateAgentResponse(text);
      const agentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handlePlayVoice = (text) => {
    // Strip markdown formatting for TTS
    const cleanText = text.replace(/[*#•_-]/g, '').trim();
    if (isPlayingVoice) {
      stopVoiceAdvisory();
    } else {
      playVoiceAdvisory(cleanText, language === 'en' ? 'en' : 'hi');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backdropFilter: 'blur(3px)'
    }} onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '620px',
          height: '85vh',
          maxHeight: '750px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#FAFDF9',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 3px 8px rgba(76, 175, 80, 0.3)'
            }}>
              <Bot size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--color-dark-green)' }}>
                  GramMitra AI Agent (कृषि मित्र)
                </strong>
                <span className="gm-badge gm-badge-green" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  ● Live Online
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <MapPin size={13} color="#EF4444" />
                <span>Active in <strong>{activeVillage}</strong>, {activeBlock}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} color="var(--color-dark-green)" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{
          padding: '0.6rem 1rem',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-dark-green)',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {p.text}
            </button>
          ))}
        </div>

        {/* Message Thread Area */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#FAFBF9'
        }}>
          {messages.map((m) => {
            const isAgent = m.sender === 'agent';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isAgent ? 'flex-start' : 'flex-end',
                  maxWidth: '88%',
                  alignSelf: isAgent ? 'flex-start' : 'flex-end'
                }}
              >
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: isAgent ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  backgroundColor: isAgent ? '#FFFFFF' : 'var(--color-primary-green)',
                  color: isAgent ? 'var(--color-primary-text)' : '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                  border: isAgent ? '1px solid #E2E8F0' : 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-line'
                }}>
                  {m.text}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  fontSize: '0.7rem',
                  color: 'var(--color-secondary-text)'
                }}>
                  <span>{m.timestamp}</span>
                  {isAgent && (
                    <button
                      onClick={() => handlePlayVoice(m.text)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-primary-green)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontWeight: 600,
                        padding: '0 4px'
                      }}
                      title="Listen spoken response"
                    >
                      <Volume2 size={13} /> आवाज में सुनें
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary-text)', fontSize: '0.8rem' }}>
              <Bot size={16} color="var(--color-primary-green)" />
              <span>कृषि मित्र सोच रहा है...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isListening ? '#EF4444' : '#F1F5F9',
              color: isListening ? '#FFFFFF' : 'var(--color-dark-green)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            title={isListening ? "Listening... click to stop" : "Speak question in Hindi or English"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={isListening ? "सुन रहा हूँ, बोलिए..." : "फसल या मौसम संबंधित सवाल पूछें..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            style={{
              flex: 1,
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              fontSize: '0.88rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: inputText.trim() ? 'var(--color-primary-green)' : '#E2E8F0',
              color: '#FFFFFF',
              cursor: inputText.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
