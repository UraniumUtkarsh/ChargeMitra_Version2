import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Home as HomeIcon, Star } from "lucide-react";

export default function Home() {
  const nav = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#071a16] to-[#022c22] text-white">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-6 sticky top-0 z-50 backdrop-blur-lg bg-black/30">
        <h1 className="text-xl font-bold text-green-400">⚡ ChargeMitra</h1>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <span
            onClick={() => scrollTo("problem")}
            className="hover:text-green-400 cursor-pointer"
          >
            THE PROBLEM
          </span>
          <span
            onClick={() => scrollTo("how")}
            className="hover:text-green-400 cursor-pointer"
          >
            HOW IT WORKS
          </span>
          <span
            onClick={() => scrollTo("economics")}
            className="hover:text-green-400 cursor-pointer"
          >
            ECONOMICS
          </span>
          <span
            onClick={() => scrollTo("impact")}
            className="hover:text-green-400 cursor-pointer"
          >
            IMPACT
          </span>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center text-center mt-28 px-4">
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-4xl md:text-6xl font-extrabold max-w-4xl"
        >
          Powering India’s EV Revolution,
        </motion.h1>

        <motion.h2
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl text-green-400 font-extrabold mt-2"
        >
          One Neighbor at a Time.
        </motion.h2>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-6 text-gray-400 max-w-xl text-lg"
        >
          Why wait for the government to build stations when your neighbor
          already has one? Join the premier Peer-to-Peer EV charging community
          developed at SRMU.
        </motion.p>

        <div className="mt-10 flex gap-5">
          <button
            onClick={() => nav("/register")}
            className="bg-green-500 px-8 py-3 rounded-xl hover:bg-green-600"
          >
            Become a Mitra
          </button>

          <button
            onClick={() => nav("/chargers-near-me")}
            className="border border-gray-500 px-8 py-3 rounded-xl hover:border-green-400"
          >
            Find a Charger
          </button>
        </div>
      </div>

      {/* 🔴 PROBLEM */}
      <section id="problem" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl text-green-400 mb-10">
          The "Infrastructure Gap"
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6 text-gray-300">
            <div className="flex gap-4">
              <span>*</span> Public fast chargers are clustered in Tier-1 cities.
            </div>
            <div className="flex gap-4">
              <span>*</span> 70% chargers in just 10 districts, Purvanchal ~2%
            </div>
            <div className="flex gap-4">
              <span>*</span> Private chargers unused for 18+ hours daily
            </div>
          </div>

          <div className="bg-white/10 p-8 rounded-2xl text-center backdrop-blur-xl">
            <h3 className="text-4xl text-green-400 font-bold">0.66M+</h3>
            <p className="text-gray-400">EVs in Uttar Pradesh</p>

            <div className="mt-6">
              <div className="h-2 bg-gray-700 rounded-full">
                <div className="h-2 bg-green-500 w-[70%] rounded-full"></div>
              </div>
              <p className="text-xs mt-2 text-gray-500">
                Concentrated Infrastructure Trap
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ⚙️ HOW */}
      <section id="how" className="py-24 px-6 bg-black/20 text-center">
        <h2 className="text-3xl mb-12">How ChargeMitra Works?</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 p-6 rounded-2xl border border-green-400/30">
          <div className="flex justify-center mb-3">
            <HomeIcon className="w-8 h-8 mb-3 text-green-400" /></div>
            <h3 className="text-xl">Host (Mitra)</h3>
            <ul className="text-gray-400 mt-2 text-sm">
              <li>• List wallbox</li>
              <li>• Set rates</li>
              <li>• Earn income</li>
            </ul>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl border border-blue-400/30">
          <div className="flex justify-center mb-3">
            <Car className="w-8 h-8 mb-3 text-blue-400" /></div>
            <h3>User (Driver)</h3>
            <ul className="text-gray-400 mt-2 text-sm">
              <li>• Discover nodes</li>
              <li>• Book slots</li>
              <li>• Pay via UPI</li>
            </ul>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl border border-purple-400/30">
          <div className="flex justify-center mb-3">
            <Star className="w-8 h-8 mb-3 text-yellow-400" /></div>
            <h3>Trust Score</h3>
            <ul className="text-gray-400 mt-2 text-sm">
              <li>• Dual rating</li>
              <li>• Monitoring</li>
              <li>• Standards</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 💰 ECONOMICS */}
      <section id="economics" className="py-24 px-6 text-center">
        <h2 className="text-3xl text-green-400 mb-4">The Mitra Economics</h2>
        <p className="text-gray-400 mb-10">
          Turning your idle parking spot into a high-yield green asset.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 p-6 rounded-2xl">
            <h3>Profit Formula</h3>
            <div className="bg-black/30 mt-2 p-2 rounded text-sm">
              Profit = (Rate - Base Cost) × Units
            </div>
            <p className="text-green-400 mt-3 text-sm">Maximize Margin</p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl">
            <h3>Estimated ROI</h3>
            <p>₹250–₹600 Daily</p>
            <p>₹7,500+ Monthly</p>
            <p className="text-blue-400 mt-2">18-Month Break-even</p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl">
            <h3>Nano-Credits</h3>
            <p className="text-gray-400 text-sm">
              1kWh = 0.8kg CO₂ offset → Rewards & Subsidies
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto text-left text-gray-300 space-y-6">
          <div>
            <strong>Q:</strong> Demand-side benefit?
            <br />
            <span className="text-gray-400">
              30–40% cheaper than public chargers.
            </span>
          </div>

          <div>
            <strong>Q:</strong> Asset-Light model?
            <br />
            <span className="text-gray-400">
              We use existing private chargers → near zero CAPEX.
            </span>
          </div>
        </div>
      </section>

      {/* 🌍 IMPACT */}
      <section id="impact" className="py-24 px-6 text-center bg-black/20">
        <h2 className="text-3xl text-green-400 mb-10">Our Impact Roadmap</h2>

        <div className="max-w-4xl mx-auto space-y-4 text-gray-300">
          <p>Partnering with EV dealerships like MG & Tata Motors</p>
          <p>Scaling to Tier-2 & Tier-3 via Asset-Light model</p>
        </div>

        <p className="mt-10 text-gray-400">
          Aligned with 6 UN Sustainable Development Goals
        </p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-5xl mx-auto mt-8">
          {[
            "7 Affordable & Clean Energy",
            "8 Decent Work & Economic Growth",
            "9 Industry, Innovation & Infrastructure",
            "11 Sustainable Cities & Communities",
            "12 Responsible Consumption & Production",
            "13 Climate Action",
          ].map((i) => (
            <div key={i} className="bg-white/10 p-5 rounded-xl">
              {i}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <div className="py-10 text-center text-gray-400 text-sm">
        Developed at Shri Ramswaroop Memorial University
        <br />
        Team: Utkarsh Pandey, Prakhar Gupta, Ashutosh Patel
        <div className="mt-6 text-green-400 font-semibold">
          Join the Charge. Become a Mitra!
        </div>
      </div>
    </div>
  );
}
