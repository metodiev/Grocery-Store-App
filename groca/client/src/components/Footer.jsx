const Footer = () => {
  return (
    <footer className="mt-20 border-t border-green-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h4 className="text-xl font-bold text-brand-dark">Groca</h4>
          <p className="mt-3 text-sm text-slate-600">Fresh groceries, trusted quality, and doorstep delivery in minutes.</p>
        </div>
        <div>
          <h5 className="font-semibold text-slate-800">Company</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>About us</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-slate-800">Help</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Track Order</li>
            <li>Return Policy</li>
            <li>Shipping Info</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-slate-800">Newsletter</h5>
          <p className="mt-3 text-sm text-slate-600">Get weekly offers and healthy picks in your inbox.</p>
        </div>
      </div>
      <p className="border-t border-green-50 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} Groca. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
