      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <label className="block text-sm mb-1">Select Broker</label>
            <select
              value={form.broker}
              onChange={(e) => setForm(prev => ({ ...prev, broker: e.target.value }))}
              className="w-full border rounded px-2 py-1 mb-4"
            >
              <option value="angel_one">AngelOne</option>
              <option value="zerodha">Zerodha</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useDummyTicks}
                onChange={(e) => setUseDummyTicks(e.target.checked)}
              />
              Use Dummy Ticks
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">{modal.title}</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap max-h-64 overflow-auto">
              {modal.content}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => setModal({ open: false, title: '', content: '' })}
            >
              Close
            </button>
          </div>
        </div>
      )}
