import React, { useState } from 'react';

interface ManageCollectionPostsProps {
  onAddCollectionPost: (name: string) => Promise<void>;
}

const ManageCollectionPosts: React.FC<ManageCollectionPostsProps> = ({ onAddCollectionPost }) => {
  const [postName, setPostName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postName.trim()) {
      setError('Nama pos penampungan tidak boleh kosong.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onAddCollectionPost(postName.trim());
      setPostName('');
    } catch (err) {
      setError('Gagal menambahkan pos. Mungkin nama sudah ada.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="newPostName" className="block text-sm font-medium text-slate-300 mb-1">Nama Pos Penampungan Baru</label>
        <input
          id="newPostName"
          type="text"
          value={postName}
          onChange={(e) => setPostName(e.target.value)}
          placeholder="cth: Pos A KUD Sejahtera"
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Menyimpan...' : 'Tambah Pos'}
      </button>
    </form>
  );
};

export default ManageCollectionPosts;