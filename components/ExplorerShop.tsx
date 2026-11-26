import React from 'react';
import { X } from 'lucide-react';
import { AVATAR_ITEMS } from '../constants';
import { useUserProfile } from '../hooks/useUserProfile';

interface ExplorerShopProps {
  onClose: () => void;
}

const ExplorerShop: React.FC<ExplorerShopProps> = ({ onClose }) => {
  const { profile, purchaseItem, equipItem } = useUserProfile();

  return (
    <div
      className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Scholar Regalia &amp; Instruments</h2>
            <p className="text-xs text-slate-500 font-mono-math">Available Balance: {profile.lp} LP</p>
          </div>
          <button onClick={onClose} aria-label="Close Shop" className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AVATAR_ITEMS.map((item) => {
            const isOwned = profile.unlockedAvatarItems.includes(item.id);
            const isEquipped = profile.equippedAvatarItems[item.type] === item.id;
            const canAfford = profile.lp >= item.cost;

            return (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize">{item.type}</span>
                    {!isOwned && <span className="font-mono-math font-semibold text-blue-700">{item.cost} LP</span>}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                </div>

                <div>
                  {isOwned ? (
                    <button
                      onClick={() => equipItem(item.id, item.type)}
                      className={`w-full py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        isEquipped
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      {isEquipped ? 'Equipped (Click to Unequip)' : 'Equip Instrument'}
                    </button>
                  ) : (
                    <button
                      onClick={() => purchaseItem(item.id, item.cost)}
                      disabled={!canAfford}
                      className="w-full py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      {canAfford ? `Acquire (${item.cost} LP)` : `Need ${item.cost - profile.lp} more LP`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExplorerShop;