import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="Super Extractor Logo" width={40} height={40} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Super Extractor</h1>
              <p className="text-sm text-gray-600">by Bixory AI</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Docs</a>
          </nav>
        </div>
      </div>
    </header>
  );
}