import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import staticFoods from '../data/staticFoods';
import foodImages from '../constants/foodImages';
import { auth, db } from '../firebase';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import ProfileAvatar from '../components/ProfileAvatar';
const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function AlimentsScreen() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const getImage = (imageName) => foodImages[imageName];

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const snapshot = await getDocs(collection(db, 'users', user.uid, 'favorites'));
        const ids = snapshot.docs.map(doc => doc.id);
        setSelectedIds(ids);
      } catch (err) {
        console.error('❌ Error loading favorites:', err.message);
      }
    };
    fetchFavorites();
  }, []);

  const handleToggleSelect = async () => {
    if (!selectedFood) return;
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, 'users', user.uid, 'favorites', selectedFood.id);
    const isSelected = selectedIds.includes(selectedFood.id);

    try {
      if (isSelected) {
        await deleteDoc(docRef);
        setSelectedIds((prev) => prev.filter((id) => id !== selectedFood.id));
      } else {
        await setDoc(docRef, selectedFood);
        setSelectedIds((prev) => [...prev, selectedFood.id]);
      }
      setSelectedFood(null);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderCategory = (category) => {
    const foods = staticFoods.filter((item) => item.category === category);
    return (
      <View key={category}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.rowWrap}>
          {foods.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                selectedIds.includes(item.id) && styles.cardSelected,
              ]}
              onPress={() => setSelectedFood(item)}
            >
              <Image
                source={getImage(item.image)}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.foodName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
        colors={Colors.gradientGreenBlue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ProfileAvatar />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Healthy Food Options</Text>
        {['Proteins', 'Carbs', 'Fats', 'Vegetables', 'Fruits'].map(renderCategory)}

      </ScrollView>

      <Modal
        visible={!!selectedFood}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedFood(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFood && (
              <>
                <Image
                  source={getImage(selectedFood.image)}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <Text style={styles.modalTitle}>{selectedFood.name}</Text>
                <Text style={styles.nutrient}>Calories: {selectedFood.calories} kcal</Text>
                <Text style={styles.nutrient}>Proteins: {selectedFood.protein} g</Text>
                <Text style={styles.nutrient}>Carbs: {selectedFood.carbs} g</Text>
                <Text style={styles.nutrient}>Fats: {selectedFood.fat} g</Text>

                <TouchableOpacity style={styles.selectButton} onPress={handleToggleSelect}>
                  <Text style={styles.selectButtonText}>
                    {selectedIds.includes(selectedFood.id) ? 'Deselect' : 'Select'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedFood(null)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    alignSelf: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 20,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: 12,
    padding: 10,
    width: ITEM_WIDTH,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
  },
  cardSelected: {
    backgroundColor: '#c6f7cb',
    borderWidth: 2,
    borderColor: Colors.greenMid,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  foodName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.bgLight,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.greenDark,
    marginBottom: 12,
  },
  nutrient: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 6,
  },
  selectButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: Colors.greenMid,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: Colors.greenDark,
    fontWeight: 'bold',
  },
});
