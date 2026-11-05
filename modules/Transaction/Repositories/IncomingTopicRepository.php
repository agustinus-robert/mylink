<?php

namespace Modules\Transaction\Repositories;

use Modules\Transaction\Models\Topics;

class IncomingTopicRepository
{

    public function paginate(array $filters)
    {}


    public function stored(array $array)
    {
        $topic = new Topics();

        $topic->fill($array);
        $topic->save();

        return $topic;
    }

    public function updated($id, array $array)
    {
        $topics = Topics::findOrFail($id);

        $topics->fill($array);
        $topics->save();

        return $topics;
    }

    public function deleted($id)
    {
        $topics = Topics::findOrFail($id);

        return $topics->delete();
    }
}
