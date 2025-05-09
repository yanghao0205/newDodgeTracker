export function migrateDodgeListData() {
    // Check if we need to migrate data
    const oldList = DataStore.get('dodgelist', []);
    const enhancedList = DataStore.get('dodgelist-enhanced', null);
    
    // If there's no enhanced list but we have an old list, migrate the data
    if (!enhancedList && oldList.length > 0) {
        const newList = oldList.map(name => ({
            name,
            addedDate: new Date().toISOString(),
            tags: [],
            note: ''
        }));
        
        DataStore.set('dodgelist-enhanced', newList);
        console.log('Migrated dodge list data to enhanced format');
    }
}
