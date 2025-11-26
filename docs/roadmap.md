# Sprintly - Product Roadmap

## 1. Core Architecture Enhancement

### 1.1 Extensible Toolbox System
**Description:** All non-essential features should be something like extensions or tools in toolbox. So the user can open the toolbox and selectively put them on the dashboard.

**Subtasks:**
- [ ] Design plugin/extension architecture
- [ ] Create toolbox UI component
- [ ] Implement feature registration system
- [ ] Add drag-and-drop interface for dashboard customization
- [ ] Build settings persistence for active tools
- [ ] *[AI] Create marketplace/library for community extensions*
- [ ] *[AI] Implement hot-reload for tool updates without app restart*
- [ ] *[AI] Add tool permission system for security*

---

## 2. Grid & Time Management Improvements

### 2.1 Flexible Todo Placement
**Description:** To-do tag should be able to be sticked on any slot, not always at the top of the action period.

**Subtasks:**
- [ ] Modify grid slot component to accept todos at any position
- [ ] Update drag-and-drop logic for free positioning
- [ ] Adjust visual indicators for flexible placement
- [ ] *[AI] Add snap-to-grid vs free-position toggle option*
- [ ] *[AI] Support multi-slot spanning for longer tasks*

### 2.2 Drag to Move Functionality
**Description:** Drag to move to-do tags on the grid.

**Dependencies:** Relates to 2.1 (Flexible Todo Placement)

**Subtasks:**
- [ ] Enhance existing drag-and-drop system for repositioning
- [ ] Add smooth animation transitions
- [ ] Implement collision detection with other todos
- [ ] Update time calculation on position change
- [ ] *[AI] Add undo/redo for drag operations*
- [ ] *[AI] Support keyboard shortcuts for nudging todos*

### 2.3 Customizable Time Window
**Description:** The user can configure to only show a period of time on the grid, e.g. only 10AM - 10PM because other time is not concerned.

**Subtasks:**
- [ ] Add time range configuration in settings
- [ ] Update grid rendering to respect time boundaries
- [ ] Implement dynamic slot generation based on range
- [ ] Save user preferences
- [ ] *[AI] Add preset templates (work hours, night shift, etc.)*
- [ ] *[AI] Support multiple time windows (e.g., exclude lunch break)*
- [ ] *[AI] Auto-adjust based on user's typical active hours*

---

## 3. Calendar Integration & Long-term Planning

### 3.1 Long-term Todo Calendar
**Description:** A calendar for long-term to-do items with or without due datetime. Those items will be automatically added on today's board.

**Subtasks:**
- [ ] Design calendar UI component
- [ ] Create data model for long-term todos
- [ ] Implement date picker for due dates
- [ ] Build auto-scheduling algorithm for daily board
- [ ] Add recurring task support
- [ ] *[AI] Implement smart priority-based scheduling*
- [ ] *[AI] Add week/month view for planning*
- [ ] *[AI] Support backlog management for tasks without dates*
- [ ] *[AI] Add deadline warnings and notifications*

### 3.2 External Calendar Import
**Description:** The calendar can be imported from other calendars.

**Dependencies:** Requires 3.1 (Long-term Todo Calendar)

**Subtasks:**
- [ ] Research calendar APIs (Google Calendar, Outlook, iCal)
- [ ] Implement OAuth authentication flows
- [ ] Build calendar sync service
- [ ] Add conflict resolution for overlapping events
- [ ] Create mapping between external events and todos
- [ ] *[AI] Support two-way sync (export changes back)*
- [ ] *[AI] Add selective import filters (work vs personal)*
- [ ] *[AI] Implement offline caching for synced data*

---

## 4. Data Persistence & Multi-device Support

### 4.1 Cloud Saving & Sync
**Description:** User functionalities to support cloud saving, multi-devices, etc.

**Subtasks:**
- [ ] Choose cloud backend (Firebase, Supabase, custom API)
- [ ] Implement user authentication system
- [ ] Build data synchronization layer
- [ ] Add conflict resolution for multi-device edits
- [ ] Implement offline-first architecture
- [ ] Create backup and restore functionality
- [ ] *[AI] Add data encryption for privacy*
- [ ] *[AI] Implement selective sync (reduce bandwidth)*
- [ ] *[AI] Support manual export/import as fallback*
- [ ] *[AI] Add family/team sharing with permissions*

---

## 5. Analytics & Insights

### 5.1 Time Tracking Statistics
**Description:** Statistics tool to show how much time are spent on each action today & in total.

**Dependencies:** Should be part of the toolbox system (1.1)

**Subtasks:**
- [ ] Create time tracking data aggregation system
- [ ] Design statistics dashboard UI
- [ ] Implement category-based time breakdown
- [ ] Add daily, weekly, monthly views
- [ ] Build chart/graph visualizations
- [ ] *[AI] Add productivity score calculation*
- [ ] *[AI] Implement goal setting and progress tracking*
- [ ] *[AI] Support exportable reports (PDF, CSV)*
- [ ] *[AI] Add comparison with previous periods*
- [ ] *[AI] Integrate Pomodoro technique insights*

---

## 6. User Engagement & Gamification

### 6.1 Daily Check-in System
**Description:** Encourage users to check-in everyday and keep their time to be tracked.

**Subtasks:**
- [ ] Design check-in UI/notification
- [ ] Implement streak tracking system
- [ ] Add daily summary/review prompts
- [ ] Create morning planning workflow
- [ ] Build evening reflection feature
- [ ] *[AI] Add achievement badges and milestones*
- [ ] *[AI] Implement gentle reminders without being pushy*
- [ ] *[AI] Support customizable check-in times*
- [ ] *[AI] Add motivational quotes/insights*
- [ ] *[AI] Create social sharing for accountability*

---

## Implementation Priority Recommendations

### Phase 1 - Foundation (Q1)
1. Extensible Toolbox System (1.1)
2. Flexible Todo Placement (2.1)
3. Drag to Move Functionality (2.2)
4. Customizable Time Window (2.3)

*[AI] Focus on core UX improvements first to establish the flexible framework*

### Phase 2 - Expansion (Q2)
1. Long-term Todo Calendar (3.1)
2. Time Tracking Statistics (5.1)
3. Daily Check-in System (6.1)

*[AI] Add planning and engagement features to increase user retention*

### Phase 3 - Integration & Scale (Q3-Q4)
1. Cloud Saving & Sync (4.1)
2. External Calendar Import (3.2)

*[AI] Once core features are solid, add connectivity and cross-platform capabilities*

---

## Technical Considerations

*[AI] **Performance:***
- *Optimize grid rendering for large time ranges*
- *Implement virtual scrolling for calendar views*
- *Use web workers for sync operations*

*[AI] **Accessibility:***
- *Ensure keyboard navigation for all drag operations*
- *Add screen reader support*
- *Support high contrast themes*

*[AI] **Mobile Support:***
- *Create responsive layouts for smaller screens*
- *Add touch-optimized interactions*
- *Consider native mobile app (React Native/PWA)*

---

## Future Ideas (Backlog)

*[AI] Additional features to consider:*
- *Time blocking templates for common workflows*
- *AI-powered task estimation and scheduling*
- *Integration with project management tools (Jira, Trello, Asana)*
- *Voice input for quick task creation*
- *Collaboration features for team planning*
- *Dark mode scheduling (auto-switch based on time)*
- *Focus mode with distraction blocking*
- *Weather and event-aware scheduling*
