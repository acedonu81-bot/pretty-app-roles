import { useState, useEffect } from 'react';
import { Users, DollarSign, Zap, Shield, Trash2, CheckCircle, XCircle, BarChart3, Activity, TrendingUp, RefreshCw, Clock, AlertTriangle, Play, Pause, Mail, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminMetrics from './admin/AdminMetrics';
import AdminCharts from './admin/AdminCharts';
import AdminValidations from './admin/AdminValidations';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminFeatureRequests from './admin/AdminFeatureRequests';
import AdminCancellations from './admin/AdminCancellations';

const AdminView = ({ onNavigate }: { onNavigate?: (view: string) => void } = {}) => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Panel <span className="text-gradient">Admin</span>
        </h2>
        <p className="text-sm text-muted-foreground">Control total del sistema XPEAK.</p>
      </div>

      <AdminMetrics />
      <AdminCharts />
      <AdminFeatureRequests />
      <AdminCancellations />
      <AdminValidations />
      <AdminUserManagement />
    </div>
  );
};

export default AdminView;
