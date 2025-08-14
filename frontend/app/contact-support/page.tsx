export default function ContactSupport() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Support</h1>
      <p className="text-gray-600 mb-6 text-center">
        Admin accounts are only created by our team. Please reach out using the form below.
      </p>
      <form className="space-y-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border rounded-lg p-2"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border rounded-lg p-2"
        />
        <textarea
          placeholder="Reason for requesting admin access"
          className="w-full border rounded-lg p-2 h-28"
        ></textarea>
        <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
          Submit Request
        </button>
      </form>
    </div>
  );
}
