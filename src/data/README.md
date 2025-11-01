# Data Directory

## ⚠️ Mock Data Removed

Mock data has been replaced with real API calls.

### Before (Mock Data)
```typescript
import { mockStudents } from '@/data/mockData';
// Used static mock data
```

### After (Real API)
```typescript
import { useStudents } from '@/hooks/useStudents';

function MyComponent() {
  const { data: students, isLoading } = useStudents();
  // Fetches real data from backend API
}
```

## Available Hooks

All data is now fetched from the backend API using React Query hooks:

### Students
- `useStudents(params)` - Get all students
- `useStudent(id)` - Get single student
- `useCreateStudent()` - Create student
- `useUpdateStudent()` - Update student
- `useDeleteStudent()` - Delete student

### Cases
- `useCases(params)` - Get all cases
- `useCase(id)` - Get single case
- `useCreateCase()` - Create case
- `useUpdateCase()` - Update case
- `useDeleteCase()` - Delete case

### Observations
- `useObservations(params)` - Get all observations
- `useObservation(id)` - Get single observation
- `useCreateObservation()` - Create observation
- `useUpdateObservation()` - Update observation
- `useDeleteObservation()` - Delete observation

### Goals
- `useGoals(caseId)` - Get goals for a case
- `useGoal(id)` - Get single goal
- `useCreateGoal()` - Create goal
- `useUpdateGoal()` - Update goal
- `useDeleteGoal()` - Delete goal

### Calendar Events
- `useCalendarEvents(params)` - Get calendar events
- `useCalendarEvent(id)` - Get single event
- `useCreateCalendarEvent()` - Create event
- `useUpdateCalendarEvent()` - Update event
- `useDeleteCalendarEvent()` - Delete event

### Risk Alerts
- `useRiskAlerts(params)` - Get risk alerts
- `useRiskAlert(id)` - Get single alert
- `useCreateRiskAlert()` - Create alert
- `useUpdateRiskAlert()` - Update alert
- `useDeleteRiskAlert()` - Delete alert

## Example Usage

```typescript
import { useStudents } from '@/hooks/useStudents';
import { useAuth } from '@/contexts/AuthContext';

function StudentsPage() {
  const { user } = useAuth();
  const { data: students, isLoading, error } = useStudents({
    school_id: user?.school_id
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {students?.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

## Migration Guide

If you have components using mock data, update them to use hooks:

### 1. Remove mock data import
```diff
- import { mockStudents } from '@/data/mockData';
+ import { useStudents } from '@/hooks/useStudents';
```

### 2. Use hook in component
```diff
- const students = mockStudents;
+ const { data: students, isLoading, error } = useStudents();
```

### 3. Handle loading and error states
```typescript
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!students) return <EmptyState />;
```

## Backend API

All hooks connect to the backend API at:
```
http://localhost:8000/api/v1
```

Make sure the backend is running before using the frontend.
