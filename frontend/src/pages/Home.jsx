import { Droplet, Users, Activity, Calendar, Shield, Award, Target, Clock, MapPin} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { campaignService } from '../services/campaignService';
import { bloodBankService } from '../services/bloodBankService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [selectedBloodBank, setSelectedBloodBank] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const res = await bloodBankService.allBloodBanksList();
        setBloodBanks(res.results || res || []);
      } catch (error) {
        console.error('Error fetching blood banks:', error);
      }
    };

    fetchBloodBanks();
  }, []);

  useEffect(() => {
    if (bloodBanks.length === 0) return;

    if (!currentUser || !currentUser?.location?.latitude || !currentUser?.location?.longitude) {
      const defaultBloodBank = bloodBanks?.find(bloodBank => bloodBank.id === 2);
      if (defaultBloodBank) {
        setSelectedBloodBank(defaultBloodBank);
      } else {
        setSelectedBloodBank(bloodBanks[0]);
      }
    } else {
      const bloodBanksWithDistance = bloodBanks
        ?.filter(bank => 
          bank && 
          bank?.location?.latitude !== null && 
          bank?.location?.latitude !== undefined && 
          bank?.location?.longitude !== null && 
          bank?.location?.longitude !== undefined)
        ?.map(bank => ({
          ...bank,
          distance: Math.sqrt(
            Math.pow(bank.location.latitude - currentUser.location.latitude, 2) + 
            Math.pow(bank.location.longitude - currentUser.location.longitude, 2)
          )
        }))
        .sort((a, b) => a.distance - b.distance);

      if (bloodBanksWithDistance.length > 0) {
        setSelectedBloodBank(bloodBanksWithDistance[0]);
      } else {
        setSelectedBloodBank(bloodBanks[0]);
      }
    }
  }, [currentUser, bloodBanks]);

  const getStatus = (blood) => {
    if (blood.units_available < blood.critical_threshold) {
      return "critical";
    } else if (blood.units_available < blood.minimum_threshold) {
      return "low";
    } else if (blood.units_available < 50) {
      return "normal";
    } else {
      return "full";
    }
  };

  const stats = [
    { icon: Users, label: 'Active Donors', value: '12,543' },
    { icon: Droplet, label: 'Blood Units', value: '988' },
    { icon: Activity, label: 'Lives Saved', value: '45,678' },
    { icon: Calendar, label: 'Donations This Month', value: '1,234' }
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await campaignService.listCampaigns();
      setCampaigns(res.results || res || []);
    };
    fetchCampaigns();
  }, []);


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
              <p className="text-lg dark:text-gray-400 text-gray-600">
                Join our community of heroes. Your donation can save up to three lives. Quick, safe, and making a real difference every day.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/dashboard/requests')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Donate Now
                </button>
                <button onClick={() => navigate('/dashboard/donors')} className="px-8 py-4 rounded-lg font-semibold transition-all border-2 dark:border-gray-700 dark:hover:bg-gray-800 border-gray-300 hover:bg-gray-100">
                  Find Blood
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative dark:bg-gray-800 bg-white p-8 rounded-3xl shadow-2xl">
                {selectedBloodBank ? (
                  <>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      {selectedBloodBank.name}
                      <span className='text-xs text-blue-700 font-semibold ms-2'>
                        ({currentUser ? "Nearest" : "Default"})
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedBloodBank?.inventory?.map((blood, idx) => {
                        const status = getStatus(blood);
                        return (
                          <div
                            key={blood.blood_group}
                            className={`p-4 rounded-xl transition-all hover:scale-105 cursor-pointer ${
                              status === 'critical' ? 'bg-red-500/20 border-2 border-red-500' :
                              status === 'low' ? 'dark:bg-orange-500/20 bg-orange-100' :
                              status === 'medium' ? 'dark:bg-yellow-500/20 bg-yellow-100' :
                              'dark:bg-green-500/20 bg-green-100'
                            }`}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                          >
                            <div className="text-2xl font-bold">{blood.blood_group}</div>
                            <div className="text-sm dark:text-gray-400 text-gray-600">
                              {blood.units_available} units
                            </div>
                            <div className={`text-xs mt-1 font-semibold ${
                              status === 'critical' ? 'text-red-500' :
                              status === 'low' ? 'text-orange-500' :
                              status === 'medium' ? 'text-yellow-500' :
                              'text-green-500'
                            }`}>
                              {status.toUpperCase()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Droplet className="w-12 h-12 mx-auto mb-3 text-gray-400 animate-pulse" />
                      <p className="text-gray-500">Loading blood bank data...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 dark:bg-gray-800/50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm dark:text-gray-400 text-gray-600">{stat.label}</div>
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
            <p className="text-lg dark:text-gray-400 text-gray-600">
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
                className="p-8 rounded-2xl transition-all hover:scale-105 dark:bg-gray-800 bg-white shadow-lg"
              >
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="dark:text-gray-400 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Campaign Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 sm:px-6 lg:px-8 my-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2 animate-pulse">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">🚨 Urgent: O- Blood Needed at Central Hospital</p>
              <p className="text-xs sm:text-sm opacity-90">Only 28 units remaining - Critical shortage</p>
            </div>
          </div>
          <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all whitespace-nowrap">
            Donate Now
          </button>
        </div>
      </div>
      {/* Campaigns Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 dark:bg-gray-800/50 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Active Blood Donation Campaigns</h2>
            <p className="text-lg dark:text-gray-400 text-gray-600">
              Join our ongoing campaigns and make an immediate impact
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {campaigns?.map((campaign) => (
              <div
                key={campaign.id}
                className="dark:bg-gray-800 bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-105 dark:hover:bg-gray-700"
              >
                <div className="bg-red-500 text-white text-center py-2 text-sm font-semibold">
                  On Going
                </div>
                {/* Campaign Banner Image */}
                <div className="relative h-48 bg-gradient-to-br from-red-500 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <Droplet className="w-16 h-16 mx-auto mb-3 opacity-90" />
                      <h3 className="text-2xl font-bold">{campaign.campaign_name}</h3>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/10"></div>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                </div>
                <div className="p-6 space-y-4">
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2 dark:text-gray-400 text-gray-600">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{campaign.address_line1},{campaign.police_station}, {campaign.city}</span>
                    </div>
                    <div className="flex items-center space-x-2 dark:text-gray-400 text-gray-600">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>{campaign.start_date} - {campaign.end_date}</span>
                    </div>
                    <div className="flex items-center space-x-2 dark:text-gray-400 text-gray-600">
                      <Target className="w-4 h-4 text-red-500" />
                      <span>Target: {campaign.target_donors}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(parseInt(campaign.collected) / parseInt(campaign.target)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2"> 
                    <div className="text-sm dark:text-gray-400 text-gray-600 mb-2">Blood Types Needed:</div>
                    <div>
                      <span 
                        className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold"
                      >
                        All Blood Group
                      </span>
                    </div>
                  </div>
                  {campaign?.registrations === false ? (
                    <Link to={`/dashboard/campaign/${campaign.id}/register`} className="block w-full bg-red-500 hover:bg-red-600 text-white text-center rounded-lg font-semibold transition-all px-4 py-2">
                      Register Now
                    </Link> 
                  ) : (
                    <div className="block w-full bg-red-300 text-white text-center rounded-lg font-semibold px-4 py-2">
                      Already Registered
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Save Lives?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of donors making a difference every day
            </p>
            <button onClick={()=>navigate('/register')} className="bg-white text-red-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Register as Donor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}