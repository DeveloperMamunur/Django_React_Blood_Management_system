import { Droplet, Users, Activity, Calendar, Shield, Award } from 'lucide-react';

export default function Home() {

  const bloodTypes = [
    { type: 'A+', units: 245, status: 'high' },
    { type: 'A-', units: 42, status: 'low' },
    { type: 'B+', units: 178, status: 'medium' },
    { type: 'B-', units: 38, status: 'low' },
    { type: 'O+', units: 312, status: 'high' },
    { type: 'O-', units: 56, status: 'medium' },
    { type: 'AB+', units: 89, status: 'medium' },
    { type: 'AB-', units: 28, status: 'critical' }
  ];

  const stats = [
    { icon: Users, label: 'Active Donors', value: '12,543' },
    { icon: Droplet, label: 'Blood Units', value: '988' },
    { icon: Activity, label: 'Lives Saved', value: '45,678' },
    { icon: Calendar, label: 'Donations This Month', value: '1,234' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted Blood Management Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Save Lives Through
                <span className="text-red-500"> Blood Donation</span>
              </h1>
              <p className={`text-lg dark:text-gray-400 text-gray-600}`}>
                Join our community of heroes. Your donation can save up to three lives. Quick, safe, and making a real difference every day.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Donate Now
                </button>
                <button className={`px-8 py-4 rounded-lg font-semibold transition-all border-2 dark:border-gray-700 dark:hover:bg-gray-800 border-gray-300 hover:bg-gray-100}`}>
                  Find Blood
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className={`relative dark:bg-gray-800' : 'bg-white'} p-8 rounded-3xl shadow-2xl`}>
                <div className="grid grid-cols-2 gap-4">
                  {bloodTypes.map((blood, idx) => (
                    <div
                      key={blood.type}
                      className={`p-4 rounded-xl transition-all hover:scale-105 cursor-pointer ${
                        blood.status === 'critical' ? 'bg-red-500/20 border-2 border-red-500' :
                        blood.status === 'low' ? ('dark:bg-orange-500/20 bg-orange-100') :
                        blood.status === 'medium' ? ('dark:bg-yellow-500/20 bg-yellow-100') :
                        ('dark:bg-green-500/20 bg-green-100')
                      }`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="text-2xl font-bold">{blood.type}</div>
                      <div className={`text-sm dark:text-gray-400' : 'text-gray-600'}`}>{blood.units} units</div>
                      <div className={`text-xs mt-1 font-semibold ${
                        blood.status === 'critical' ? 'text-red-500' :
                        blood.status === 'low' ? 'text-orange-500' :
                        blood.status === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {blood.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 dark:bg-gray-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className={`text-sm dark:text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose LifeFlow?</h2>
            <p className={`text-lg dark:text-gray-400 text-gray-600`}>
              Modern blood management made simple and efficient
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: 'Real-time Tracking', desc: 'Monitor blood inventory levels in real-time across all centers' },
              { icon: Shield, title: 'Safe & Secure', desc: 'HIPAA compliant with bank-level security for all data' },
              { icon: Award, title: 'Quality Assured', desc: 'Rigorous testing and screening for all blood donations' }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl transition-all hover:scale-105 dark:bg-gray-800 bg-white shadow-lg}`}
              >
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={'dark:text-gray-400 text-gray-600'}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={"bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-12 text-center text-white"}>
            <h2 className="text-4xl font-bold mb-4">Ready to Save Lives?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of donors making a difference every day
            </p>
            <button className="bg-white text-red-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Register as Donor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}