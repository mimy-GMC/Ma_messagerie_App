import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
  background: '#FFF7F0',
  orange: '#FF8C00',
  green: '#2E7D32',
  greenLight: '#A5D6A7',
  white: '#FFFFFF',
  gray: '#757575',
  messageSent: '#FF8C00',
  messageReceived: '#E8F5E9',
  inputBackground: '#FFFFFF',
  border: '#FFE0B2',
};

// Messages de démonstration (propres à chaque conversation)
const initialMessages = {
  '1': [
    { id: '1a', text: 'Salut ! Comment ça va ?', sent: false },
    { id: '1b', text: 'Super, et toi ? 😊', sent: true },
    { id: '1c', text: 'On se voit demain ?', sent: false },
    { id: '1d', text: 'Oui, avec plaisir !', sent: true },
  ],
  default: [
    { id: '0a', text: 'Hello !', sent: false },
    { id: '0b', text: 'Coucou !', sent: true },
  ],
};

export default function ChatScreen({ route, navigation }) {
  const { conversationId, name } = route.params;
  const [messages, setMessages] = useState(
    initialMessages[conversationId] || initialMessages.default
  );
  const [input, setInput] = useState('');

  // Mettre à jour le titre de l'écran
  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  // Envoyer un message texte
  const sendMessage = () => {
    const text = input.trim();
    if (text.length === 0) return;
    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      text,
      sent: true,
    };
    setMessages([newMessage, ...messages]);
    setInput('');
  };

  // Ouvrir la galerie pour choisir une image ou vidéo
  const pickMedia = async () => {
    // Demander la permission (iOS surtout)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Tu dois autoriser l’accès à la galerie pour envoyer une image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // photos + vidéos
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const newMessage = {
        id: Date.now().toString(),
        type: asset.type === 'video' ? 'video' : 'image',
        uri: asset.uri,
        sent: true,
      };
      setMessages([newMessage, ...messages]);
    }
  };

  // Prendre une photo avec l'appareil
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Tu dois autoriser l’accès à la caméra pour prendre une photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const newMessage = {
        id: Date.now().toString(),
        type: 'image',
        uri: asset.uri,
        sent: true,
      };
      setMessages([newMessage, ...messages]);
    }
  };

  // Rendu d'un message (texte ou image)
  const renderMessage = ({ item }) => {
    const isSent = item.sent;
    const rowStyle = isSent ? styles.sentRow : styles.receivedRow;
    const bubbleStyle = isSent ? styles.sentBubble : styles.receivedBubble;
    const textStyle = isSent ? styles.sentText : styles.receivedText;

    if (item.type === 'image' || item.type === 'video') {
      return (
        <View style={rowStyle}>
          <View style={[bubbleStyle, styles.mediaBubble]}>
            <Image source={{ uri: item.uri }} style={styles.mediaContent} resizeMode="cover" />
            {item.type === 'video' && (
              <Text style={[styles.mediaLabel, { color: isSent ? COLORS.white : COLORS.gray }]}>🎥 Vidéo</Text>
            )}
          </View>
        </View>
      );
    }

    // Message texte classique
    return (
      <View style={rowStyle}>
        <View style={[bubbleStyle, styles.textBubble]}>
          <Text style={[styles.messageText, textStyle]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
          renderItem={renderMessage}
        />

        {/* Barre de saisie avec bouton média */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={() => {
            Alert.alert(
              'Joindre un média',
              'Choisis une option',
              [
                { text: 'Galerie', onPress: pickMedia },
                { text: 'Appareil photo', onPress: takePhoto },
                { text: 'Annuler', style: 'cancel' },
              ],
              { cancelable: true }
            );
          }}>
            <Text style={styles.attachButtonText}>+</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Écris ton message..."
            placeholderTextColor={COLORS.gray}
            value={input}
            onChangeText={setInput}
            multiline
            blurOnSubmit={false}
            onSubmitEditing={() => {
              // Envoi quand on appuie sur "Entrée"
              sendMessage();
            }}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            activeOpacity={0.7}
          >
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles (ajustés)
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  messageList: { paddingHorizontal: 12, paddingTop: 8 },
  sentRow: { alignItems: 'flex-end', marginBottom: 8 },
  receivedRow: { alignItems: 'flex-start', marginBottom: 8 },
  textBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mediaBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 4,
  },
  sentBubble: { backgroundColor: COLORS.messageSent },
  receivedBubble: { backgroundColor: COLORS.messageReceived },
  messageText: { fontSize: 16 },
  sentText: { color: COLORS.white },
  receivedText: { color: COLORS.green },
  mediaContent: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  mediaLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attachButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 250,
    minHeight: 80,
    color: '#333',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: COLORS.green,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});