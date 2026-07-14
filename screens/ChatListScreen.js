import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

// Thème orange & vert
const COLORS = {
  background: '#FFF7F0',
  orange: '#FF8C00',
  green: '#2E7D32',
  greenLight: '#A5D6A7',
  white: '#FFFFFF',
  gray: '#757575',
  online: '#4CAF50', // vert pour le point en ligne
};

// Données simulées avec statut en ligne
const initialConversations = [
  { id: '1', name: 'Alice', lastMessage: 'On se voit demain ?', time: '10:45', online: true },
  { id: '2', name: 'Bob', lastMessage: 'Super, merci !', time: '09:30', online: false },
  { id: '3', name: 'Charlie', lastMessage: 'Tu as vu la photo ?', time: 'Hier', online: true },
  { id: '4', name: 'Diane', lastMessage: '😂😂😂', time: 'Lun', online: false },
];

// Couleurs alternées pour les avatars (orange / vert)
const avatarColors = [COLORS.orange, COLORS.green, COLORS.orange, COLORS.green];

export default function ChatListScreen({ navigation }) {
  const [active, setActive] = useState(initialConversations);
  const [archived, setArchived] = useState([]);

  // Déplacer une conversation vers la liste archivée
  const archive = (id) => {
    const conv = active.find(c => c.id === id);
    if (conv) {
      setActive(prev => prev.filter(c => c.id !== id));
      setArchived(prev => [conv, ...prev]);
    }
  };

  // Remettre une conversation dans la liste active
  const unarchive = (id) => {
    const conv = archived.find(c => c.id === id);
    if (conv) {
      setArchived(prev => prev.filter(c => c.id !== id));
      setActive(prev => [conv, ...prev]);
    }
  };

  // Supprimer définitivement une conversation (active ou archivée)
  const deleteConv = (id, isArchived) => {
    if (isArchived) {
      setArchived(prev => prev.filter(c => c.id !== id));
    } else {
      setActive(prev => prev.filter(c => c.id !== id));
    }
    Alert.alert('Supprimée', 'Conversation supprimée définitivement');
  };

  // Actions visibles lors du swipe à gauche (bouton Supprimer)
  const renderRightActions = (id, isArchived) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteConv(id, isArchived)}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    );
  };

  // Actions visibles lors du swipe à droite (bouton Archiver ou Désarchiver)
  const renderLeftActions = (id, isArchived) => {
    const label = isArchived ? 'Désarchiver' : 'Archiver';
    const action = isArchived ? () => unarchive(id) : () => archive(id);
    return (
      <TouchableOpacity
        style={[styles.archiveButton, isArchived && styles.unarchiveButton]}
        onPress={action}
      >
        <Text style={styles.archiveButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  // Rendu d'un élément de conversation
  const renderConversation = ({ item, index, isArchived }) => (
    <Swipeable
      renderLeftActions={() => renderLeftActions(item.id, isArchived)}
      renderRightActions={() => renderRightActions(item.id, isArchived)}
      overshootLeft={false}
      overshootRight={false}
    >
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('Chat', { conversationId: item.id, name: item.name })}
        activeOpacity={0.7}
      >
        {/* Avatar avec indicateur de présence */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: avatarColors[index % avatarColors.length] }]}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
          {/* Point vert si en ligne */}
          {item.online && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  // Construction des données pour la FlatList (sections avec en-têtes)
  const sections = [];
  if (active.length > 0) {
    sections.push({ type: 'header', title: 'Conversations récentes', key: 'header-active' });
    active.forEach((item, index) => {
      sections.push({ type: 'chat', data: item, isArchived: false, index, key: item.id });
    });
  }
  if (archived.length > 0) {
    sections.push({ type: 'header', title: 'Archivées', key: 'header-archived' });
    archived.forEach((item, index) => {
      sections.push({ type: 'chat', data: item, isArchived: true, index, key: item.id });
    });
  }

  // Rendu d'un élément de la FlatList (header ou conversation)
  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{item.title}</Text>
        </View>
      );
    }
    // Conversation
    return renderConversation({ item: item.data, index: item.index, isArchived: item.isArchived });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 30,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: COLORS.gray,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.gray,
  },
  // Boutons swipe
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    marginVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  archiveButton: {
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    marginVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  unarchiveButton: {
    backgroundColor: COLORS.green, // vert pour désarchiver
  },
  archiveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});