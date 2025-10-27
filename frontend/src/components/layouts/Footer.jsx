import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className={`dark:bg-gray-800 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                            <span className="font-bold text-lg">LifeFlow</span>
                        </div>
                        <p className={`text-sm dark:text-gray-400 text-gray-600'}`}>
                            Connecting donors with those in need, saving lives one donation at a time.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <div className="space-y-2 text-sm">
                            <a href="#" className={`block dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}>About Us</a>
                            <a href="#" className={`block dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}>Donate Blood</a>
                            <a href="#" className={`block dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}>Find Blood</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <div className="space-y-2 text-sm">
                            <a href="#" className={`block dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}>FAQs</a>
                            <a href="#" className={`block dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}>Contact</a>
                            <a href="#" className={`block dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}>Privacy Policy</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-red-500" />
                                <span className={'dark:text-gray-400 text-gray-600'}>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-red-500" />
                                <span className={'dark:text-gray-400 text-gray-600'}>info@lifeflow.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className={'dark:text-gray-400 text-gray-600'}>123 Medical Center Dr</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`pt-8 border-t dark:border-gray-700 border-gray-300'} text-center text-sm dark:text-gray-400' : 'text-gray-600'}`}>
                    <p>&copy; 2025 LifeFlow Blood Management System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}