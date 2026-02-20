import { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function PestDatabase() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pests = [
    {
      id: 1,
      name: 'Brown Planthopper',
      sinhalaName: 'දුඹුරු කොළ මැසි',
      tamilName: 'பழுப்பு வெட்டுக்கிளி',
      image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?w=400',
    },
    {
      id: 2,
      name: 'Tea Mosquito Bug',
      sinhalaName: 'තේ මසුන් මැසි',
      tamilName: 'தேயிலை கொசு பூச்சி',
      image: 'https://images.unsplash.com/photo-1640551724267-9b84c715aa35?w=400',
    },
    {
      id: 3,
      name: 'Coconut Rhinoceros Beetle',
      sinhalaName: 'පොල් ගෙඩි මුලු',
      tamilName: 'தென்னை காண்டாமிருக வண்டு',
      image: 'https://images.unsplash.com/photo-1714073619098-606600c7b5a0?w=400',
    },
    {
      id: 4,
      name: 'Fruit Fly',
      sinhalaName: 'පළතුරු මැසි',
      tamilName: 'பழ ஈ',
      image: 'https://images.unsplash.com/photo-1736584279723-79776b062028?w=400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>Pest Database</h1>
          <p className="text-gray-600">Manage pest information and control methods</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" style={{ backgroundColor: '#2E7D32' }}>
              <Plus className="w-4 h-4" />
              Add New Pest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Pest</DialogTitle>
              <DialogDescription>
                Enter pest information in multiple languages and upload training images for AI identification.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-6 mt-4">
              {/* Pest Names */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEnglish">Pest Name (English)</Label>
                  <Input id="nameEnglish" placeholder="e.g., Brown Planthopper" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameSinhala">Pest Name (Sinhala)</Label>
                  <Input id="nameSinhala" placeholder="e.g., දුඹුරු කොළ මැසි" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameTamil">Pest Name (Tamil)</Label>
                  <Input id="nameTamil" placeholder="e.g., பழுப்பு வெட்டுக்கிளி" />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Training Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop multiple images
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                </div>
              </div>

              {/* Affected Crop Stage */}
              <div className="space-y-2">
                <Label htmlFor="cropStage">Affected Crop Stage</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seedling">Seedling</SelectItem>
                    <SelectItem value="vegetative">Vegetative</SelectItem>
                    <SelectItem value="reproductive">Reproductive</SelectItem>
                    <SelectItem value="ripening">Ripening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Control Methods Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Control Methods</h3>

                {/* Chemical Recommendations */}
                <div className="space-y-2">
                  <Label htmlFor="chemical">Chemical Recommendations</Label>
                  <Textarea
                    id="chemical"
                    rows={4}
                    placeholder="Enter chemical pesticides and their application guidelines..."
                    className="resize-none"
                  />
                </div>

                {/* Traditional Kem Methods - Highlighted */}
                <div
                  className="p-4 rounded-lg space-y-2"
                  style={{ backgroundColor: '#F3E5D5' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 rounded" style={{ backgroundColor: '#8B4513' }}></div>
                    <Label htmlFor="kem" className="text-lg" style={{ color: '#8B4513' }}>
                      Traditional 'Kem' Methods 🌿
                    </Label>
                  </div>
                  <p className="text-sm text-gray-700 italic mb-2">
                    Indigenous knowledge and organic practices passed down through generations
                  </p>
                  <Textarea
                    id="kem"
                    rows={5}
                    placeholder="Enter traditional organic methods, natural pesticides, and indigenous practices... (e.g., neem oil, wood ash, botanical extracts)"
                    className="resize-none"
                    style={{ backgroundColor: '#FFFBF5' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#2E7D32' }}>
                  Save Pest Information
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pest Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        {pests.map((pest) => (
          <Card key={pest.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-square overflow-hidden">
              <img
                src={pest.image}
                alt={pest.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{pest.name}</h3>
              <p className="text-sm text-gray-600">{pest.sinhalaName}</p>
              <p className="text-sm text-gray-600">{pest.tamilName}</p>
            </div>
          </Card>
        ))}

        {/* Add New Card */}
        <Card
          className="flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50 transition-colors border-2 border-dashed"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Add New Pest</p>
        </Card>
      </div>
    </div>
  );
}