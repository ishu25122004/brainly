import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./button";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ open, onClose }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generateShareLink() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const url = `${window.location.origin}/share/${response.data.hash}`;
      setShareUrl(url);
    } catch (err) {
      console.error("Error generating share link:", err);
      setError("Failed to generate share link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function disableSharing() {
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: false },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setShareUrl("");
      onClose();
    } catch (err) {
      console.error("Error disabling share:", err);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSocialShare(platform: string) {
    const text = encodeURIComponent("Check out my Second Brain on Brainly!");
    const url = encodeURIComponent(shareUrl);
    let shareLink = "";

    switch (platform) {
      case "whatsapp":
        shareLink = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "email":
        shareLink = `mailto:?subject=${text}&body=Here is the link: ${url}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer");
    }
  }

  function handleClose() {
    setShareUrl("");
    setCopied(false);
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-500/50 dark:bg-slate-900/80 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-border-base dark:border-gray-800 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white">
              Share Your Second Brain
            </h2>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              <CrossIcon />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {!shareUrl ? (
              <div className="text-center space-y-6">
                <div>
                  <p className="text-sm text-text-secondary dark:text-gray-300 text-left leading-relaxed">
                    Share your entire collection of notes, documents, tweets, and videos with others. They'll be able to import your content into their own Second Brain.
                  </p>
                </div>
                {error && (
                  <p className="text-sm text-danger-500 bg-danger-500/10 dark:bg-danger-500/20 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}
                <div>
                  <Button
                    onClick={generateShareLink}
                    variant="primary"
                    text="Share Brain"
                    size="lg"
                    fullWidth={true}
                    loading={loading}
                    startIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>
                    }
                  />
                  <p className="text-xs text-text-muted mt-3">3 items will be shared</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-1 rounded-xl bg-gray-50 border border-border-base">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-transparent px-3 py-2.5 text-sm text-text-primary outline-none truncate"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer flex-shrink-0
                        ${
                          copied
                            ? "bg-success-500/20 text-success-500"
                            : "bg-accent-600 text-white hover:bg-accent-500"
                        }`}
                    >
                      {copied ? (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                          Copy
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Social Share Section */}
                <div>
                  <p className="text-sm font-medium text-text-primary mb-3 text-left">Share on Socials</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleSocialShare('whatsapp')} className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="WhatsApp">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                    </button>
                    <button onClick={() => handleSocialShare('twitter')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="X (Twitter)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                    </button>
                    <button onClick={() => handleSocialShare('linkedin')} className="w-10 h-10 rounded-full bg-[#0a66c2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                    </button>
                    <button onClick={() => handleSocialShare('facebook')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
                    </button>
                    <button onClick={() => handleSocialShare('email')} className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Email">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/></svg>
                    </button>
                  </div>
                </div>

                <Button
                  onClick={disableSharing}
                  variant="danger"
                  text="Disable Sharing"
                  size="md"
                  fullWidth={true}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
