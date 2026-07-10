import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useUIStore } from '../store/uiStore';

export default function Settings() {
  const { isDarkMode, toggleTheme, reducedMotion, setReducedMotion, language, setLanguage } = useUIStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-textSecondary text-sm mt-1">Preferences and Accessibility configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accessibility & Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Theme</h4>
                <p className="text-sm text-textSecondary">High contrast mode for enterprise operations.</p>
              </div>
              <button 
                role="switch" 
                aria-checked={isDarkMode} 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-surfaceHighlight'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-textPrimary transition-transform ${isDarkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reduced Motion</h4>
                <p className="text-sm text-textSecondary">Disable UI animations and transitions.</p>
              </div>
              <button 
                role="switch" 
                aria-checked={reducedMotion} 
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-12 h-6 rounded-full transition-colors relative ${reducedMotion ? 'bg-primary' : 'bg-surfaceHighlight'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-textPrimary transition-transform ${reducedMotion ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localization & Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">System Language</h4>
              <select 
                aria-label="Select system language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surfaceHighlight/50 border border-borderWhite/20 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <h4 className="font-medium mb-2">Alert Preferences</h4>
              <div className="space-y-2 text-sm text-textSecondary">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-borderWhite/20 bg-surfaceHighlight text-primary focus:ring-primary" />
                  <span>Push Notifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-borderWhite/20 bg-surfaceHighlight text-primary focus:ring-primary" />
                  <span>Audio Alerts (Critical Only)</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
