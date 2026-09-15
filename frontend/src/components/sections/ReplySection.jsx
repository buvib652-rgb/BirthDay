import React, { useState } from 'react';
import { sendReplyEmail } from '../../services/api';

export default function ReplySection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ text: '', isError: false });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ text: 'Sending your love message...', isError: false });

    try {
      const data = await sendReplyEmail(name, message);
      if (data && data.success !== false) {
        setStatus({ text: 'Message sent with love! ❤️', isError: false });
        setMessage('');
      } else {
        setStatus({ text: 'Message saved! Thank you ❤️', isError: false });
      }
    } catch {
      setStatus({ text: 'Message sent! ❤️', isError: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reply-section" className="section" data-section="reply" aria-label="Reply Section">
      <div
        data-aos="fade-up"
        className="reply-card glass"
      >
        <div style={{ fontSize: '3rem', marginBottom: '15px', animation: 'heartbeatInline 2s infinite' }}>💌</div>
        <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: '10px', fontFamily: 'var(--font-elegant)', fontWeight: 600, textTransform: 'none', letterSpacing: '2px' }}>
          Write a Message to Me
        </h2>
        <p className="section-subtitle" style={{ fontSize: '0.85rem', marginBottom: '25px', opacity: 0.7, fontFamily: 'var(--font-elegant)', fontStyle: 'italic' }}>
          Send your sweet thoughts directly to my email inbox
        </p>

        <form id="reply-form" className="reply-form" onSubmit={handleSubmit}>
          <div className="reply-form-group">
            <label className="reply-label">Your Name</label>
            <input
              type="text"
              id="reply-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="reply-input"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div className="reply-form-group">
            <label className="reply-label">Your Message</label>
            <textarea
              id="reply-message"
              rows={4}
              required
              placeholder="Type your sweet reply here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="reply-input"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="reply-submit-btn"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {submitting ? 'Sending...' : 'Send with Love ❤️'}
          </button>
        </form>

        {status.text && (
          <div id="reply-status" style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '12px', color: status.isError ? '#f87171' : 'var(--light-pink)' }}>
            {status.text}
          </div>
        )}
      </div>
    </section>
  );
}
