import logo from '../../assets/logo.svg';

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1dbc60] to-[#54a43f] flex items-center justify-center">
      <div className="animate-pulse">
        <img 
          src={logo} 
          alt="Tarla360 Logo" 
          className="w-32 h-32 object-contain drop-shadow-2xl" 
        />
      </div>
    </div>
  );
}
