import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, GraduationCap, Shield, Heart, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedBackground } from '@/components/ui/animated-background';
import TeachersOnboarding from '@/components/onboarding/TeachersOnboarding';
import CounsellorsOnboarding from '@/components/onboarding/CounsellorsOnboarding';
import SchoolAdminsOnboarding from '@/components/onboarding/SchoolAdminsOnboarding';
import StudentsOnboarding from '@/components/onboarding/StudentsOnboarding';
import ClassesOnboarding from '@/components/onboarding/ClassesOnboarding';

export default function OnboardingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teachers');

  const tabs = [
    { value: 'teachers', label: 'Teachers', icon: GraduationCap, gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-500/10 to-cyan-500/10' },
    { value: 'counsellors', label: 'Counsellors', icon: Heart, gradient: 'from-pink-500 to-rose-500', bgGradient: 'from-pink-500/10 to-rose-500/10' },
    { value: 'admins', label: 'Admins', icon: Shield, gradient: 'from-purple-500 to-indigo-500', bgGradient: 'from-purple-500/10 to-indigo-500/10' },
    { value: 'students', label: 'Students', icon: UserPlus, gradient: 'from-orange-500 to-amber-500', bgGradient: 'from-orange-500/10 to-amber-500/10' },
    { value: 'classes', label: 'Classes', icon: BookOpen, gradient: 'from-teal-500 to-cyan-500', bgGradient: 'from-teal-500/10 to-cyan-500/10' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      
      {/* Enhanced Header */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <UserPlus className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                User Onboarding
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-15">
              Manage teachers, counsellors, admins, parents, and students
            </p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="border-2 shadow-xl overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <CardContent className="p-2">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-transparent h-auto p-0">
                {tabs.map((tab, index) => (
                  <motion.div
                    key={tab.value}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <TabsTrigger 
                      value={tab.value} 
                      className="relative flex items-center justify-center py-2.5 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none h-auto group w-full border-2 border-transparent data-[state=active]:border-primary/20 rounded-lg transition-all duration-300 hover:border-primary/10"
                    >
                      {/* Active background gradient */}
                      {activeTab === tab.value && (
                        <motion.div
                          layoutId="activeTabBackground"
                          className={`absolute inset-0 bg-gradient-to-br ${tab.bgGradient} rounded-lg`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tab.bgGradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Label */}
                      <span className={`text-sm font-semibold transition-colors relative z-10 ${
                        activeTab === tab.value ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        {tab.label}
                      </span>

                      {/* Active indicator line at bottom */}
                      {activeTab === tab.value && (
                        <motion.div
                          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.gradient}`}
                          layoutId="activeIndicator"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </CardContent>
          </Card>

          {/* Tab Contents with enhanced animations */}
          <TabsContent value="teachers" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <TeachersOnboarding schoolId={user?.school_id || ''} />
            </motion.div>
          </TabsContent>

          <TabsContent value="counsellors" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <CounsellorsOnboarding schoolId={user?.school_id || ''} />
            </motion.div>
          </TabsContent>

          <TabsContent value="admins" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SchoolAdminsOnboarding schoolId={user?.school_id || ''} />
            </motion.div>
          </TabsContent>

          <TabsContent value="students" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <StudentsOnboarding schoolId={user?.school_id || ''} />
            </motion.div>
          </TabsContent>

          <TabsContent value="classes" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ClassesOnboarding schoolId={user?.school_id || ''} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
