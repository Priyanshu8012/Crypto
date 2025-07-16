import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes countdown

  const fetchCoins = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/coins`);
      setCoins(data);
      setTimeLeft(1800); // reset timer after fetch
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  useEffect(() => {
    fetchCoins();

    const refreshInterval = setInterval(fetchCoins, 1800000); // 30 min
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-yellow-300">
          💹 Top 10 Cryptocurrencies
        </h1>
        <p className="text-center text-sm text-gray-300 mb-4">
          ⏳ Next auto-refresh in: <span className="font-semibold">{Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
        </p>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-sm text-left border-collapse bg-white text-gray-800">
            <thead className="bg-slate-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Market Cap</th>
                <th className="py-3 px-4">24h %</th>
                <th className="py-3 px-4">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr key={coin.coinId} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="py-3 px-4 font-medium">{coin.name}</td>
                  <td className="py-3 px-4 uppercase">{coin.symbol}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">${coin.price.toFixed(2)}</td>
                  <td className="py-3 px-4">${coin.marketCap.toLocaleString()}</td>
                  <td className={`py-3 px-4 font-semibold ${coin.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {coin.change24h?.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-xs">{new Date(coin.lastUpdated).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          Powered by <a href="https://www.coingecko.com/" className="underline hover:text-yellow-400" target="_blank">CoinGecko API</a>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
