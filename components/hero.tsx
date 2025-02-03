export function Hero() {
  const randomImageIndex = Math.floor(Math.random() * 18);  // Generate a random integer between 0 and 17
  const randomImage = `https://raw.githubusercontent.com/riivana/All-nighter-random-images/refs/heads/main/image${randomImageIndex}.webp`;

  return (
    <div 
      className="bg-cover bg-center text-white py-20" 
      style={{ backgroundImage: randomImage ? `url(${randomImage})` : 'none' }}
    >
      <div className="container mx-auto px-4 text-center backdrop-blur-lg bg-black/50 rounded-lg">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow-md">
          Unlock Your Ultimate Valentine's Experience
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Find the perfect companion to make this day unforgettable
        </p>
        <button className="bg-primary hover:bg-primary/80 text-black font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg">
          Get Started Now
        </button>
      </div>
    </div>
  );
}
