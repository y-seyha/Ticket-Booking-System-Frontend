import { FaGithub } from "react-icons/fa";

export default function OAuthButtons({
  onGoogle,
  onGithub,
}: {
  onGoogle: () => void;
  onGithub: () => void;
}) {
  return (
    <div className="space-y-3 mt-6">
      <button onClick={onGoogle} className="w-full py-3 border rounded-xl">
        Continue with Google
      </button>

      <button
        onClick={onGithub}
        className="w-full py-3 border rounded-xl flex justify-center gap-2"
      >
        <FaGithub /> Continue with GitHub
      </button>
    </div>
  );
}
