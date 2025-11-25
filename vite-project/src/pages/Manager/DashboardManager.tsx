import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  UserX, 
  TrendingUp,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function DashboardManager() {
  const handleNavigation = (path: string) => {
    console.log(`Navigation vers: ${path}`);
  };

  const quickActions = [
    {
      title: "Gestion des Congés",
      description: "Demandes, validations et suivi des congés des employés",
      icon: Calendar,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "from-emerald-400 to-teal-500",
      path: "/leave",
      stats: "24 en attente"
    },
    {
      title: "Gestion des Absences", 
      description: "Suivi et contrôle des absences et retards",
      icon: UserX,
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      bgGradient: "from-rose-50 to-pink-50",
      iconBg: "from-rose-400 to-pink-500",
      path: "/absence",
      stats: "8 aujourd'hui"
    },
    {
      title: "Évaluation de Performance",
      description: "Évaluations, objectifs et développement des compétences",
      icon: TrendingUp,
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      bgGradient: "from-violet-50 to-purple-50",
      iconBg: "from-violet-400 to-purple-500",
      path: "/performance",
      stats: "12 à réaliser"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Card de Bienvenue */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <CardContent className="p-8 md:p-12 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Système de Gestion RH</span>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                    Bonjour, Administrateur ! 👋
                  </h1>
                  <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                    Tableau de bord centralisé pour la gestion des congés, le suivi des absences et l'évaluation des performances.
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[120px]">
                  <div className="text-5xl font-bold text-white mb-1">
                    {new Date().getDate()}
                  </div>
                  <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">
                    {new Date().toLocaleDateString('fr-FR', { month: 'long' })}
                  </div>
                  <div className="text-xs text-blue-200 mt-2">
                    {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards d'Actions Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div 
                key={index} 
                onClick={() => handleNavigation(action.path)}
                className="group cursor-pointer"
              >
                <Card className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full bg-gradient-to-br ${action.bgGradient} hover:scale-[1.02]`}>
                  {/* Barre supérieure gradient */}
                  <div className={`h-1.5 bg-gradient-to-r ${action.gradient}`}></div>
                  
                  <CardContent className="p-8">
                    {/* Icône avec effet 3D */}
                    <div className="mb-6 relative">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${action.iconBg} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
                      </div>
                      {/* Badge de notification */}
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        !
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                        {action.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {action.description}
                      </p>

                      {/* Stats */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${action.gradient} bg-opacity-10`}>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${action.gradient} animate-pulse`}></div>
                        <span className="text-sm font-semibold text-gray-700">
                          {action.stats}
                        </span>
                      </div>
                    </div>

                    {/* Footer avec bouton d'action */}
                    <div className="mt-6 pt-4 border-t border-gray-200/50">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`}>
                          Accéder au module
                        </span>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                          <ChevronRight className={`h-5 w-5 text-gray-700 group-hover:translate-x-1 transition-transform duration-300`} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}