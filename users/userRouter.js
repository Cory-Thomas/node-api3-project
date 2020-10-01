const express = require( 'express' );
const db = require( './userDb' )
const router = express.Router();

router.post( '/', async (req, res) => {
  try {
    const returnObj = await db.insert( req.body );
    res.status(201).json({ data: returnObj });
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
});

router.post( '/:id/posts', validateUserId, async ( req, res ) => {
  try {
    const returnObj = await db.insert( req.body );
    res.status(201).json({ data: returnObj });
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
});

router.get( '/', async ( req, res ) => {
  try {
    const returnObj = await db.get();
    res.status(200).json({ data: returnObj });
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
});

router.get( '/:id', validateUserId, async ( req, res ) => {
  try {
    const returnObj = await db.getById( req.params.id );
    res.status(200).json({ data: returnObj });
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
});

router.get( '/:id/posts', validateUserId, async ( req, res ) => {
  try {
    const returnObj = await db.getUserPosts( req.params.id );
    res.status(200).json({ data: returnObj });
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
});

router.delete( '/:id', validateUserId, async ( req, res ) => {
  try {
    const returnObj = await db.remove( req.params.id );
    res.status(204).json({ data: returnObj });
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
});

router.put( '/:id', validateUserId, async ( req, res ) => {
  try {
    const count = await db.update( req.params.id, req.body );
    if (count == 1){
      res.status(200).json({ data: returnObj });
    } else {
      throw error;
    } 
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
});

//custom middleware

async function validateUserId( req, res, next ) {
  try {
    const found = await db.getById( req.params.id );
    if ( found ){
      req.user = found;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    };
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
};

async function validateUser( req, res, next ) {
  try {
    const { user } = req.body;
    if ( user ){
      next();
    } else {
      res.status(400).json({ message: "invalid user" });
    };
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
}

async function validatePost( req, res, next ) {
  try {
    const { id, text } = req.body;
    if ( id && text ){ // body is there
      next();
    } else if (!text) {
      res.status(400).json({ message: "missing required text field" }); // text missing, id is there
    } else {
      res.status(400).json({ message: "missing post data" }); // body and id missing
    };
  } catch {
    res.status(500).json({ message: "internal server error" });
  };
}

module.exports = router;
