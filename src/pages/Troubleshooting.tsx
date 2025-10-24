import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import emailjs from 'emailjs-com';

const Troubleshooting = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formError, setFormError] = useState('');
  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (reportText.trim().length < 30) {
      setFormError('Please enter at least 30 characters.');
      return;
    }

    setFormError('');
    setLoading(true);

    try {
      await emailjs.sendForm('service_0dh5581', 'template_jtoprgk', form, 'UyvBq61C2etUUTDB7');
      setSubmitted(true);
      form.reset();
      setReportText('');
      setFormImageUrl('');
    } catch (error: any) {
      console.error('EmailJS error:', error);
      if (error?.status === 413) {
        setFormError('Submission failed: content size exceeds the allowed limit.');
      } else {
        setFormError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-full flex flex-col items-center justify-start px-4 py-10 text-white bg-[#1d1d1d] overflow-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Submit Ticket</h1>

      <div className="max-w-xl w-full space-y-6 text-sm text-justify">
        <h2 className="text-base font-semibold">Can't create or access video-conference?</h2>
        <section>
          <h2 className="font-semibold mb-2">Why this might happen</h2>
          <p className="text-gray-300">
            Our app uses the Agora SDK to power real-time video and audio. If you're unable to create or join a session, it's possible that our free usage quota with Agora has been fully consumed.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">What you can do</h2>
          <p className="text-gray-300">
            You can report this issue so our developers can investigate and resolve it. Please describe what happened below.
          </p>
        </section>

        <h2 className="text-base font-semibold">Want to report a problem?</h2>
        <section>
          <h2 className="font-semibold mb-2">For Other Concerns</h2>
          <p className="text-gray-300">
            For additional inquiries—including reports of technical issues, software bugs, inappropriate behavior, or any other matters related to the service—please feel free to submit them here. Our team will review and address them promptly.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Tips for Reporting a User</h2>
          <p className="text-gray-300">
            When reporting a user, please provide as much relevant information as possible to help our team investigate effectively. This may include the email address, username, or any identifying details available. If applicable, include screenshots, timestamps, or a brief description of the incident. Clear and specific reports allow us to respond more accurately and promptly.
          </p>
        </section>

        {!submitted ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="title" value="User Report" />
            <input type="hidden" name="name" value="VirtuSense Report" />

            <label className="block text-sm font-medium text-gray-300">
              Image URL (optional)
            </label>
            <input
              type="text"
              name="image_url"
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              placeholder="Paste image link here"
              className="w-full text-sm text-gray-300 bg-[#2d2d2d] border border-gray-600 rounded-md p-2"
            />

            <textarea
              name="message"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe the issue here..."
              className="w-full h-32 resize-none p-3 rounded-md bg-[#2d2d2d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a7368]"
            />
            <p className="text-xs text-gray-400">Minimum 30 characters required.</p>

            {formError && (
              <p className="text-xs text-red-400 mt-1">{formError}</p>
            )}

            <button
              type="submit"
              disabled={loading || reportText.trim().length < 30}
              className={`w-full py-2 rounded-md font-medium transition ${
                loading || reportText.trim().length < 30
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#1a7368] hover:bg-[#165b53] text-white'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        ) : (
          <div className="text-green-400 text-sm text-center">
            Thank you for your patience. Your report has reached the developers. Please allow some time for us to investigate and fix the issue. We’re sorry for the inconvenience.
          </div>
        )}

        <p
          className="text-gray-500 hover:text-gray-400 text-sm text-center cursor-pointer"
          onClick={() => history.push('/')}
        >
          Return to Home
        </p>
      </div>
    </div>
  );
};

export default Troubleshooting;